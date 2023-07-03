import chalk from "chalk";
import { join, relative } from "path";

import { getDockerStatus } from "../helpers/docker-info";
import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Common from "../common";

import { BOLT } from "../constants/bolt-configs";

import { RunServiceOptions } from "../typings/run-service-options";
import { StoreServices } from "../typings/store-service";

import { Bolt } from "../typings/bolt";
import ServiceRunner from "../runners/service";
import { DockerConfig, LocalConfig } from "../typings/project-runner-config";

export default class ServiceUp {
  //

  public async checkIfAlreadyUp(_yamlContent: Bolt, serviceName: string) {
    const store = await getStore();
    const data: StoreServices = store.get("services") || [];
    const service = data[serviceName];
    if (service && service.status === "up") {
      await exitWithMsg(
        `>> "${serviceName}" service is already up on ${service.serviceRunner}`
      );
    }
  }

  public async handle(
    serviceName: string,
    options: RunServiceOptions
  ): Promise<void> {
    const { serviceRunner } = options;

    if (serviceRunner === "docker") {
      const isDockerRunning = await getDockerStatus();
      if (!isDockerRunning) {
        exitWithMsg("Unable to connect with docker!");
      }
    }

    const { _yamlContent } = await Common.validateServiceInBoltYaml(
      serviceName
    );

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    await this.checkIfAlreadyUp(_yamlContent, serviceName);

    const { servicePath, content } = await Common.getAndValidateService(
      serviceName,
      _yamlContent
    );

    // if service doesn't contain given platform, exit
    if (!content.service_runners[serviceRunner]) {
      await exitWithMsg(
        `>> service ${serviceName}: "${relative(
          ".",
          join(servicePath, BOLT.SERVICE_YAML_FILE_NAME)
        )}" doesn't support ${serviceRunner} platform`
      );
    }

    const { envfile, build, ports, volumes } =
      content.service_runners[serviceRunner];

    // generates .env
    await Common.generateEnv();

    let PID: any = null;
    const runnerService = new ServiceRunner();
    switch (serviceRunner) {
      case "docker":
        const dockerConfig: DockerConfig = {
          containerName: content.container_name,
          servicePath: servicePath,
          build: build,
          ports: ports || [],
          envFile: envfile,
          volumes: volumes || [],
          isFollow: false,
        };
        await runnerService.docker(dockerConfig, {
          action: "start",
          serviceName: serviceName,
        });
        PID = content.container_name;
        break;
      case "local":
        const localConfig: LocalConfig = {
          servicePath: servicePath,
          build: build,
          serviceName: serviceName,
          isFollow: false,
          processId: 0,
        };
        PID = await runnerService.local(localConfig, {
          action: "start",
        });
        break;
    }

    console.log(
      chalk.green(
        `\n"${serviceName}" service is up on ${serviceRunner} platform\n`
      )
    );
  }
}
