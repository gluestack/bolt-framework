import chalk from "chalk";
import { join, relative } from "path";

import { getDockerStatus } from "../helpers/docker-info";
import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";
import { updateStore } from "../helpers/update-store";

import Common from "../common";

import { BOLT } from "../constants/bolt-configs";

import { RunServiceOptions } from "../typings/run-service-options";
import { StoreService, StoreServices } from "../typings/store-service";

import Docker from "../runners/docker";
import Local from "../runners/local";
import { Bolt } from "../typings/bolt";

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

    const { envfile, build, ports, volumes, context } =
      content.service_runners[serviceRunner];

    // generates .env
    await Common.generateEnv();

    let PID: any = null;

    switch (serviceRunner) {
      case "docker":
        await Docker.start(
          content.container_name,
          servicePath,
          build,
          ports || [],
          envfile,
          volumes
        );
        PID = content.container_name;
        break;
      case "local":
        PID = await Local.start(context || servicePath, build, serviceName);
        break;
    }

    const json: StoreService = {
      status: "up",
      serviceRunner: serviceRunner,
      port: ports,
      processId: PID,
    };

    await updateStore("services", serviceName, json);
    await updateStore("project_runner", "host");

    console.log(
      chalk.green(
        `\n"${serviceName}" service is up on ${serviceRunner} platform\n`
      )
    );
  }
}
