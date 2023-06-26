// import { exitWithMsg } from "../../helpers/exit-with-msg";
// import { exists } from "../../helpers/fs-exists";
// import { updateAllServicesStatus } from "../../helpers/update-all-services-status";
// import { updateStore } from "../../helpers/update-store";
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import { Bolt } from "../../typings/bolt";
    // import { StoreService } from "../../typings/store-service";
    // import { validateVmConfig } from "../../validations/bolt-vm";
    // import { createProjectInVm } from "@gluestack-v2/bolt";
    // import { runProjectInVm } from "../../runners/vm/run-project-in-vm";
    class ProjectRunnerVm {
    }
    exports.default = ProjectRunnerVm;
});
