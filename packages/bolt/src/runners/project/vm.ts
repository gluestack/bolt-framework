// import { exitWithMsg } from "../../helpers/exit-with-msg";
// import { exists } from "../../helpers/fs-exists";
// import { updateAllServicesStatus } from "../../helpers/update-all-services-status";
// import { updateStore } from "../../helpers/update-store";

// import { Bolt } from "../../typings/bolt";
// import { StoreService } from "../../typings/store-service";

// import { validateVmConfig } from "../../validations/bolt-vm";

// import { createProjectInVm } from "@gluestack-v2/bolt";
// import { runProjectInVm } from "../../runners/vm/run-project-in-vm";

export default class ProjectRunnerVm {
  // _yamlContent: Bolt;
  // constructor(_yamlContent: Bolt) {
  //   this._yamlContent = _yamlContent;
  // }
  // public async up(cache: boolean) {
  //   const _yamlContent = this._yamlContent;
  //   // const vmConfig = _yamlContent.server.vm;
  //   const projectPath = vmConfig.source;
  //   await validateVmConfig(vmConfig);
  //   if (!projectPath || !(await exists(projectPath))) {
  //     exitWithMsg(`>> "${projectPath}" specified in source doesn't exists`);
  //   }
  //   // await createProjectInVm(projectPath, { cache: cache });
  //   // await runProjectInVm(projectPath, { detatch: true });
  //   await updateStore("environment", "server", "vm");
  //   const json: StoreService = {
  //     status: "up",
  //     platform: "vm",
  //     port: null,
  //     processId: null,
  //   };
  //   await updateAllServicesStatus(_yamlContent, json, { reset: false });
  //   // Updating the store
  //   await updateStore("project_runner", "vm");
  // }
  // public async down() {
  //   const yamlContent = this._yamlContent;
  //   const sourcePath = yamlContent.server.vm.source;
  //   if (!sourcePath) {
  //     exitWithMsg(">> VM source path not found.");
  //   }
  //   // await downProjectInVm(_yamlContent.server.vm.source);
  //   const json: StoreService = {
  //     status: "down",
  //     platform: null,
  //     port: null,
  //     processId: null,
  //   };
  //   await updateAllServicesStatus(yamlContent, json, { reset: false });
  //   await updateStore("project_runner", "none");
  // }
}
