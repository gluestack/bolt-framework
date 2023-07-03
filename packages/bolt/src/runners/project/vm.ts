import { exitWithMsg } from "../../helpers/exit-with-msg";
import { updateAllServicesStatus } from "../../helpers/update-all-services-status";
import { updateStore } from "../../helpers/update-store";

import { Bolt } from "../../typings/bolt";
import ProjectRunner from "../../typings/bolt-project-runner";

import { ServiceRunners, StoreService } from "../../typings/store-service";

import { validateVmConfig } from "../../validations/bolt-vm";
import BoltVm from "@gluestack/boltvm";
import Common from "../../common";

export default class ProjectRunnerVm implements ProjectRunner {
  _yamlContent: Bolt;
  boltVM: BoltVm;

  constructor(_yamlContent: Bolt) {
    this._yamlContent = _yamlContent;
    this.boltVM = new BoltVm(process.cwd());
  }

  private resolveServiceRunner(
    defaultServiceRunner: ServiceRunners,
    providedRunner: Array<ServiceRunners>
  ) {
    if (providedRunner.includes(defaultServiceRunner)) {
      return defaultServiceRunner;
    } else {
      return providedRunner[0];
    }
  }

  private async updateStatusOfAllServices() {
    const _yamlContent = this._yamlContent;
    const defaultServiceRunner = _yamlContent.default_service_runner;

    Object.entries(_yamlContent.services).forEach(async ([serviceName]) => {
      // Validating and getting content from bolt.service.yaml
      const { content } = await Common.getAndValidateService(
        serviceName,
        _yamlContent
      );

      const runner = this.resolveServiceRunner(
        defaultServiceRunner,
        Object.keys(content.service_runners) as Array<ServiceRunners>
      );

      const json: StoreService = {
        status: "up",
        serviceRunner: runner,
        port: null,
        processId: null,
      };

      await updateStore("services", serviceName, json);
    });
  }

  public async up(cache: boolean): Promise<void> {
    try {
      // Validating boltVm Dependencies
      await this.boltVM.doctor();

      const _yamlContent = this._yamlContent;
      const vmConfig = _yamlContent.vm;
      if (!vmConfig) {
        exitWithMsg(`>> No vm config found in bolt.yaml`);
        return;
      }

      //   const projectPath = vmConfig.source;
      await validateVmConfig(vmConfig);
      await this.boltVM.create(cache);

      // Updating the status of all services
      await this.updateStatusOfAllServices();
      // Updating the store
      await updateStore("project_runner", "vm");

      await this.boltVM.run(true);
    } catch (error: any) {
      exitWithMsg(`Error occured executing bolt up: ${error.message}`);
    }
  }

  public async down(): Promise<void> {
    try {
      // Validating boltVm Dependencies
      await this.boltVM.doctor();

      const yamlContent = this._yamlContent;
      await this.boltVM.down();
      const json: StoreService = {
        status: "down",
        serviceRunner: null,
        port: null,
        processId: null,
      };
      await updateAllServicesStatus(yamlContent, json, { reset: false });
      await updateStore("project_runner", "none");
    } catch (error: any) {
      exitWithMsg(`Error occured executing bolt down: ${error.message}`);
    }
  }

  public async exec(): Promise<void> {
    try {
      // Validating boltVm Dependencies
      await this.boltVM.doctor();

      await this.boltVM.exec();
    } catch (error: any) {
      exitWithMsg(`Error occured executing bolt exec: ${error.message}`);
    }
  }
}
