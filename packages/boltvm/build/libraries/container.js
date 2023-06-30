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
        define(["require", "exports", "os", "path", "chalk", "../helpers/fs-exists", "../helpers/fs-mkdir", "../helpers/fs-copyfile", "../helpers/exit-with-msg", "../helpers/fs-remove-folder", "../constants/bolt-vm"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const os_1 = __importDefault(require("os"));
    const path_1 = require("path");
    const chalk_1 = __importDefault(require("chalk"));
    const fs_exists_1 = require("../helpers/fs-exists");
    const fs_mkdir_1 = require("../helpers/fs-mkdir");
    const fs_copyfile_1 = require("../helpers/fs-copyfile");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const fs_remove_folder_1 = require("../helpers/fs-remove-folder");
    const bolt_vm_1 = require("../constants/bolt-vm");
    class Container {
        constructor(containerName) {
            this.containersPath = (0, path_1.join)(os_1.default.homedir(), bolt_vm_1.BOLTVM.METADATA_FOLDER, bolt_vm_1.BOLTVM.CONTAINER_FOLDER);
            this.containerName = containerName;
        }
        createImage(cached) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield (0, fs_exists_1.exists)(this.containersPath))) {
                    yield (0, fs_mkdir_1.createFolder)(this.containersPath);
                }
                const projectContainerPath = (0, path_1.join)(this.containersPath, `${this.containerName}`);
                if (!(yield (0, fs_exists_1.exists)(projectContainerPath))) {
                    yield (0, fs_mkdir_1.createFolder)(projectContainerPath);
                }
                if (!cached) {
                    console.log(chalk_1.default.yellow(`>> Creating Image...`));
                    yield (0, fs_copyfile_1.copyFile)(bolt_vm_1.VM_BINARIES.ALPINE, projectContainerPath, bolt_vm_1.VM_BINARIES.CONTAINER_IMAGE_NAME);
                    console.log(chalk_1.default.green(`>> Image created!`));
                }
                if (!(yield (0, fs_exists_1.exists)((0, path_1.join)(projectContainerPath, bolt_vm_1.VM_BINARIES.CONTAINER_IMAGE_NAME)))) {
                    console.log(chalk_1.default.yellow(`>> Image Not found! Creating image for ${this.containerName}...`));
                    yield (0, fs_copyfile_1.copyFile)(bolt_vm_1.VM_BINARIES.ALPINE, projectContainerPath, bolt_vm_1.VM_BINARIES.CONTAINER_IMAGE_NAME);
                    console.log(chalk_1.default.green(`>> Image created for ${this.containerName}!`));
                }
                return projectContainerPath;
            });
        }
        removeImage() {
            return __awaiter(this, void 0, void 0, function* () {
                const projectContainerPath = (0, path_1.join)(this.containersPath, `${this.containerName}`);
                if (!(yield (0, fs_exists_1.exists)(projectContainerPath))) {
                    (0, exit_with_msg_1.exitWithMsg)(">> Container does not exist");
                }
                yield (0, fs_remove_folder_1.removeFolder)(projectContainerPath);
                console.log(chalk_1.default.green(`>> Container ${this.containerName} removed`));
                return true;
            });
        }
    }
    exports.default = Container;
});
