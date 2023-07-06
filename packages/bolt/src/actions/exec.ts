import Common from "../common";
import { BOLT } from "../constants/bolt-configs";
import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { getStoreData } from "../helpers/get-store-data";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";
import ServiceRunnerVM from "../runners/service/vm";
import { Bolt } from "../typings/bolt";
import { ProjectRunners } from "../typings/store-service";
import { validateVmConfig } from "../validations/bolt-vm";

export default class Exec {
  private async validateBoltYaml() {
    //Validate bolt.yaml file
    const _yamlContent = await Common.getAndValidateBoltYaml();

    return { _yamlContent };
  }

  private async validateMetadataForVM(_yamlContent: Bolt): Promise<void> {
    const vmStatus = await getStoreData("vm");

    if (vmStatus !== "up") {
      exitWithMsg(`VM is not running. Please run bolt vm up`);
    }
  }

  public async handle() {
    try {
      const { _yamlContent } = await this.validateBoltYaml();

      // Validations for metadata and services
      await validateMetadata();
      await validateServices();
      this.validateMetadataForVM(_yamlContent);

      await ServiceRunnerVM.exec();
    } catch (error: any) {
      exitWithMsg("Error occured executing bolt exec: ", error.message);
    }
  }
}
