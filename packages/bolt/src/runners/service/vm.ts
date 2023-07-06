import BoltVm from "@gluestack/boltvm";

import { updateStore } from "../../helpers/update-store";
import { getStoreData } from "../../helpers/get-store-data";

import BoltServiceRunner from "../../typings/bolt-service-runner";
import { StoreService } from "../../typings/store-service";
import { BoltService } from "../../typings/bolt-service";
import chalk from "chalk";
import { BOLT } from "../../constants/bolt-configs";
import { exitWithMsg } from "../../helpers/exit-with-msg";

export default class ServiceRunnerVM implements BoltServiceRunner {
  boltVM: BoltVm;

  cache: boolean;
  runnerType: "vmlocal" | "vmdocker";
  serviceContent: BoltService;
  serviceName: string;

  constructor(
    serviceContent: BoltService,
    serviceName: string,
    cache: boolean,
    runnerType: "vmlocal" | "vmdocker"
  ) {
    this.boltVM = new BoltVm(process.cwd());
    this.cache = cache;
    this.runnerType = runnerType;
    this.serviceContent = serviceContent;
    this.serviceName = serviceName;
  }

  private async getVmStatus(): Promise<string | void> {
    const vmStatus = await getStoreData("vm");
    return vmStatus;
  }

  private async exposePort(
    vmServiceRunnerType: "local" | "docker"
  ): Promise<string[] | void> {
    const serviceRunner = this.serviceContent.service_runners;
    const ports = serviceRunner[vmServiceRunnerType].ports;
    if (!ports) {
      console.log(
        chalk.red(
          `>> No ports defined in ${BOLT.SERVICE_YAML_FILE_NAME} to expose`
        )
      );
      return;
    }

    // Exposing ports in vm
    await this.boltVM.exposePort(ports);

    return ports;
  }

  public async start(): Promise<void> {
    try {
      // Validating boltVm Dependencies
      await this.boltVM.doctor();

      const vmStatus = await this.getVmStatus();

      if (!vmStatus || vmStatus !== "up") {
        await this.boltVM.create(this.cache);
        await updateStore("vm", "up");
      }

      // Command to start service in vm
      const serviceUpBaseCommand = `bolt service:up ${this.serviceName} --service-runner`;
      const vmServiceRunnerType =
        this.runnerType === "vmlocal" ? "local" : "docker";

      // Running service in vm
      await this.boltVM.run(
        `${serviceUpBaseCommand} ${vmServiceRunnerType}`,
        true
      );

      const ports = await this.exposePort(vmServiceRunnerType);

      // Updating store
      const json: StoreService = {
        status: "up",
        serviceRunner: this.runnerType,
        projectRunner: "vm",
        port: ports || null,
        processId: null,
      };

      await updateStore("services", this.serviceName, json);
    } catch (error: any) {
      console.log(
        chalk.red(
          `Some error occured while running service ${this.serviceName} in VM: ${error.message}`
        )
      );
    }
  }

  public async stop(): Promise<void> {
    try {
      // Validating boltVm Dependencies
      await this.boltVM.doctor();

      const vmStatus = await this.getVmStatus();

      if (!vmStatus || vmStatus !== "up") {
        exitWithMsg(`>> Unable to stop ${this.serviceName} as VM is down`);
      }

      // Command to stop service in vm
      const serviceDownCommand = `bolt service:down ${this.serviceName}`;

      // Running service in vm
      await this.boltVM.executeCommand(`${serviceDownCommand}`, true);

      // Updating store
      const json: StoreService = {
        status: "down",
        serviceRunner: null,
        projectRunner: null,
        port: null,
        processId: null,
      };

      await updateStore("services", this.serviceName, json);
    } catch (error: any) {
      console.log(
        chalk.red(
          `>> Some error occured while stopping service ${this.serviceName} in VM: ${error.message}`
        )
      );
    }
  }

  public async logs(isFollow: boolean): Promise<void> {
    try {
      // Validating boltVm Dependencies
      await this.boltVM.doctor();

      const vmStatus = await this.getVmStatus();

      if (!vmStatus || vmStatus !== "up") {
        exitWithMsg(
          `>> Unable to get logs for ${this.serviceName} as VM is down`
        );
      }

      // Command to stop service in vm
      let servicelogCommand = `bolt log ${this.serviceName}`;
      if (isFollow) {
        servicelogCommand += " --follow";
      }

      // Running service in vm
      await this.boltVM.executeCommand(`${servicelogCommand}`, false);
    } catch (error: any) {
      console.log(
        chalk.red(
          `>> Some error occured while getting logs for service ${this.serviceName} in VM: ${error.message}`
        )
      );
    }
  }

  public static async exec(): Promise<void> {
    try {
      const boltVM = new BoltVm(process.cwd());
      // Validating boltVm Dependencies
      await boltVM.doctor();

      await boltVM.exec();
    } catch (error: any) {
      exitWithMsg(`>> Error occured executing bolt exec: ${error.message}!`);
    }
  }

  public static async down(): Promise<void> {
    try {
      const boltVM = new BoltVm(process.cwd());
      // Validating boltVm Dependencies
      await boltVM.doctor();

      await boltVM.down();

      await updateStore("vm", "down");
    } catch (error: any) {
      console.log(
        chalk.red(`>> Some error occured while stopping VM: ${error.message}`)
      );
    }
  }
}
