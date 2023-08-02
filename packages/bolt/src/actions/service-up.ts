import chalk from "chalk";
import { join } from "path";

import { getDockerStatus } from "../helpers/docker-info";
import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Common from "../common";

import { RunServiceOptions } from "../typings/run-service-options";
import { StoreServices } from "../typings/store-service";

import { Bolt } from "../typings/bolt";
import ServiceRunner from "../runners/service";
import {
  DockerConfig,
  LocalConfig,
  VMConfig,
} from "../typings/service-runner-config";
import { BoltService, hostServicerunner } from "../typings/bolt-service";
import interpolate from "../helpers/data-interpolate";
import PortDiscovery from "./port-discovery";
import EnvGenerate from "./env-generate";
import { rewriteEnvViaRegExpression } from "../helpers/rewrite-env";
import { getOs } from "../helpers/get-os";
import { getStoreData } from "../helpers/get-store-data";

export default class ServiceUp {
  //

  private async checkIfAlreadyUp(_yamlContent: Bolt, serviceName: string) {
    const store = await getStore();
    const data: StoreServices = store.get("services") || [];
    const service = data[serviceName];
    if (service && service.status === "up") {
      await exitWithMsg(
        `>> "${serviceName}" service is already up on ${service.serviceRunner}`
      );
    }
  }

  private validateServiceRunnerConfig(
    content: BoltService,
    serviceRunnerKey: hostServicerunner
  ) {
    const config = content.service_runners[serviceRunnerKey];
    if (!config) {
      return false;
    }

    return true;
  }

  public async checkDependentServicesStatus(
    serviceName: string,
    dependentServices: string[]
  ) {
    const storeServices: StoreServices = await getStoreData("services");
    for (const dependentService of dependentServices) {
      if (
        !storeServices[dependentService] ||
        storeServices[dependentService].status !== "up"
      ) {
        await exitWithMsg(
          `>> ${serviceName} is dependent on "${dependentService}" which is not up!`
        );
      }
    }
  }

  public async handle(
    serviceName: string,
    options: RunServiceOptions
  ): Promise<void> {
    try {
      let { serviceRunner: srOption, cache } = options;

      // Validations for metadata and services
      await validateMetadata();
      await validateServices();

      if (srOption === "docker") {
        const isDockerRunning = await getDockerStatus();
        if (!isDockerRunning) {
          exitWithMsg("Unable to connect with docker!");
        }
      }

      const { _yamlContent } = await Common.validateServiceInBoltYaml(
        serviceName
      );

      await this.checkIfAlreadyUp(_yamlContent, serviceName);

      const { servicePath, content } = await Common.getAndValidateService(
        serviceName,
        _yamlContent
      );

      // Check if service is dependent on other services and dependents are up or not
      if (content.depends_on) {
        await this.checkDependentServicesStatus(
          serviceName,
          content.depends_on
        );
      }

      if (!content.supported_service_runners.includes(srOption)) {
        console.log(
          chalk.yellow(
            `>> Given "${srOption}" service runner is not supported for ${serviceName}, using "${content.supported_service_runners[0]}" instead!`
          )
        );
        srOption = content.supported_service_runners[0];
      }

      // Discovering Ports
      const portDiscovery = new PortDiscovery(content);
      const discoveredPorts = await portDiscovery.handle();

      // generating envs for the service
      console.log(chalk.gray(`>> Generating .env files...`));
      const envGenerate = new EnvGenerate();
      await envGenerate.handle({
        environment: "local",
        serviceInfo: {
          ports: discoveredPorts.ports,
          serviceName: serviceName,
          servicePath: servicePath,
          ingress: _yamlContent.ingress,
        },
      });

      // Make data interpolate into service-runner's yaml content from given env file :: LOCAL
      if (content?.service_runners?.local) {
        const { envfile } = content.service_runners["local"];
        const localENVPath = join(servicePath, envfile);

        content.service_runners.local = await interpolate(
          content.service_runners.local,
          localENVPath
        );
      }

      // Make data interpolate into service-runner's yaml content from given env file :: DOCKER
      if (content?.service_runners?.docker) {
        const { envfile } = content.service_runners["docker"];
        const dockerENVPath = join(servicePath, envfile);

        content.service_runners.docker = await interpolate(
          content.service_runners.docker,
          dockerENVPath
        );
      }

      let isConfigValid = false;
      const serviceRunner = new ServiceRunner();
      switch (srOption) {
        case "local":
          isConfigValid = this.validateServiceRunnerConfig(content, "local");
          if (!isConfigValid) {
            console.log(
              chalk.red(`>> No config found for local in bolt.service.yaml`)
            );
            return;
          }

          const localBuild = content.service_runners.local.build;

          const localConfig: LocalConfig = {
            servicePath: servicePath,
            build: localBuild,
            processId: 0,
            ports: content.service_runners.local.ports || [],
          };

          await serviceRunner.local(localConfig, {
            action: "start",
            serviceName: serviceName,
          });
          break;

        case "docker":
          isConfigValid = this.validateServiceRunnerConfig(content, "docker");
          if (!isConfigValid) {
            console.log(
              chalk.red(`>> No config found for docker in bolt.service.yaml`)
            );
            return;
          }

          // Replace %_ASSIGNED_HOST% with host.docker.internal in .env file for mac
          const operatingSystem = getOs();
          if (operatingSystem !== "linux") {
            const regularExpression = /%[^%]+_ASSIGNED_HOST%/g;
            await rewriteEnvViaRegExpression(
              servicePath,
              regularExpression,
              "host.docker.internal"
            );
          }

          const {
            build: dockerBuild,
            ports,
            volumes,
            envfile,
          } = content.service_runners.docker;

          const dockerConfig: DockerConfig = {
            containerName: content.container_name,
            servicePath: servicePath,
            build: dockerBuild,
            ports: ports || [],
            envFile: envfile,
            volumes: volumes || [],
          };

          await serviceRunner.docker(dockerConfig, {
            action: "start",
            serviceName: serviceName,
          });
          break;

        case "vmlocal":
          isConfigValid = this.validateServiceRunnerConfig(content, "local");
          if (!isConfigValid) {
            console.log(
              chalk.red(
                `>> To run service in vmlocal, no config found for local in bolt.service.yaml`
              )
            );
            return;
          }

          const vmConfig: VMConfig = {
            serviceContent: content,
            serviceName: serviceName,
            cache: cache || false,
            runnerType: "vmlocal",
          };

          await serviceRunner.vm(vmConfig, {
            action: "start",
            serviceName: serviceName,
          });
          break;

        case "vmdocker":
          isConfigValid = this.validateServiceRunnerConfig(content, "docker");
          if (!isConfigValid) {
            console.log(
              chalk.red(
                `>> To run service in vmdocker, no config found for docker in bolt.service.yaml`
              )
            );
            return;
          }
          const vmdockerConfig: VMConfig = {
            serviceContent: content,
            serviceName: serviceName,
            cache: cache || false,
            runnerType: "vmdocker",
          };

          await serviceRunner.vm(vmdockerConfig, {
            action: "start",
            serviceName: serviceName,
          });
          break;
      }

      console.log(
        chalk.green(
          `\n"${serviceName}" service is up on ${srOption} platform\n`
        )
      );
    } catch (error: any) {
      exitWithMsg(`>> Errorwhile running service-up: ${error.message}`);
    }
  }
}
