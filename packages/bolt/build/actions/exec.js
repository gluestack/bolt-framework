// import openSshTerminal from "@gluestack-v2/sealvm/build/actions/exec";
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
    // import { exitWithMsg } from "../helpers/exit-with-msg";
    // import getStore from "../helpers/get-store";
    // import { validateMetadata } from "../helpers/validate-metadata";
    // import { validateServices } from "../helpers/validate-services";
    // import Common from "../common";
    const chalk_1 = __importDefault(require("chalk"));
    // import { Bolt } from "../typings/bolt";
    // import { validateVmConfig } from "../validations/bolt-vm";
    class Exec {
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
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.green("coming soon..."));
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
    exports.default = Exec;
});
