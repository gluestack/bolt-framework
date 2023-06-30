import _ from "lodash";
import Common from "../common";
import { BOLT } from "../constants/bolt-configs";
import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";
import ProjectRunner from "../runners/project";
import { Bolt } from "../typings/bolt";
import { ProjectRunners } from "../typings/store-service";
import { validateVmConfig } from "../validations/bolt-vm";

export default class Exec {
  private async validateBoltYaml() {
    //Validate bolt.yaml file
    const _yamlContent = await Common.getAndValidateBoltYaml();
    const vmServerConfig = _yamlContent.vm;
    if (!vmServerConfig) {
      exitWithMsg(`VM server config not found in ${BOLT.YAML_FILE_NAME}`);
      process.exit();
    }
    const vmConfig = await validateVmConfig(vmServerConfig);
    return { _yamlContent, vmConfig };
  }

  private validateMetadataForVM(
    _yamlContent: Bolt,
    projectRunner: ProjectRunners
  ): void {
    if (!projectRunner) {
      exitWithMsg("Either environment or server not found in metadata");
    }
    if (projectRunner === "none") {
      exitWithMsg(`${_yamlContent.project_name} is not running`);
    }
    if (projectRunner !== "vm") {
      exitWithMsg(`${_yamlContent.project_name} is running on host machine`);
    }
  }

  public async handle() {
    try {
      const { _yamlContent, vmConfig } = await this.validateBoltYaml();

      // Validations for metadata and services
      await validateMetadata();
      await validateServices();
      const store = await getStore();
      const currentProjectRunner: ProjectRunners = await store.get(
        "project_runner"
      );
      this.validateMetadataForVM(_yamlContent, currentProjectRunner);

      const projectRunner = new ProjectRunner(_yamlContent);
      await projectRunner.vm({ action: "exec" });
    } catch (error: any) {
      exitWithMsg("Error occured executing bolt exec: ", error.message);
    }
  }
}
