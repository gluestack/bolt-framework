// import openSshTerminal from "@gluestack-v2/sealvm/build/actions/exec";

// import { exitWithMsg } from "../helpers/exit-with-msg";
// import getStore from "../helpers/get-store";
// import { validateMetadata } from "../helpers/validate-metadata";
// import { validateServices } from "../helpers/validate-services";

// import Common from "../common";
import chalk from "chalk";
// import { Bolt } from "../typings/bolt";

// import { validateVmConfig } from "../validations/bolt-vm";

export default class Exec {
  // private async validateBoltYaml() {
  //   //Validate seal.yaml file
  //   const _yamlContent = await Common.getAndValidateBoltYaml();
  //   const vmServerConfig = _yamlContent.server.vm;
  //   if (!vmServerConfig) {
  //     exitWithMsg("VM server config not found in seal.yaml");
  //   }
  //   const vmConfig = await validateVmConfig(vmServerConfig);
  //   return { _yamlContent, vmConfig };
  // }
  // private validateMetadata(
  //   _yamlContent: Bolt,
  //   projectRunner: "vm" | "host" | "none"
  // ): void {
  //   if (!projectRunner) {
  //     exitWithMsg("Either environment or server not found in metadata");
  //   }
  //   if (projectRunner === "none") {
  //     exitWithMsg(`${_yamlContent.project_name} is not running`);
  //   }
  //   if (projectRunner !== "vm") {
  //     exitWithMsg(`${_yamlContent.project_name} is running on host machine`);
  //   }
  // }
  public async handle() {
    console.log(chalk.green("coming soon..."));
    process.exit();
    //   try {
    //     const { _yamlContent, vmConfig } = await this.validateBoltYaml();
    //     // Validations for metadata and services
    //     await validateMetadata();
    //     await validateServices();
    //     const store = await getStore();
    //     const projectRunner: "vm" | "host" | "none" = await store.get(
    //       "project_runner"
    //     );
    //     this.validateMetadata(_yamlContent, projectRunner);
    //     // await openSshTerminal(vmConfig.source);
    //   } catch (error: any) {
    //     exitWithMsg("Error occured executing seal exec: ", error.message);
    //   }
  }
}
