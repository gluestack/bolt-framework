// import { exitWithMsg } from "../../helpers/exit-with-msg";
// import { exists } from "../../helpers/fs-exists";
// import { updateAllServicesStatus } from "../../helpers/update-all-services-status";
// import { updateStore } from "../../helpers/update-store";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    // import { Bolt } from "../../typings/bolt";
    // import { StoreService } from "../../typings/store-service";
    // import { validateVmConfig } from "../../validations/bolt-vm";
    // import { createProjectInVm } from "@gluestack-v2/bolt";
    // import { runProjectInVm } from "../../runners/vm/run-project-in-vm";
    class ProjectRunnerVm {
        constructor(_yamlContent) {
            this._yamlContent = _yamlContent;
        }
        up(cache) {
            return __awaiter(this, void 0, void 0, function* () {
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
            });
        }
        down() {
            return __awaiter(this, void 0, void 0, function* () {
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
            });
        }
        exec() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.green("Coming soon..."));
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
            });
        }
    }
    exports.default = ProjectRunnerVm;
});
