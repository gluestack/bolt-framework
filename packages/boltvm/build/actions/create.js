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
        define(["require", "exports", "path", "chalk", "adm-zip", "../helpers/execute-detached", "../helpers/exit-with-msg", "../helpers/fs-exists", "../helpers/update-store", "../helpers/validate-bolt-file", "../helpers/get-ssh-port", "../helpers/fs-remove-folder", "../helpers/fs-mkdir", "../helpers/download-base-image", "../helpers/fs-removefile", "../helpers/validate-project-status", "../helpers/execute", "../libraries/container", "../runners/vm", "../constants/bolt-vm"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const chalk_1 = __importDefault(require("chalk"));
    const adm_zip_1 = __importDefault(require("adm-zip"));
    const execute_detached_1 = require("../helpers/execute-detached");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const fs_exists_1 = require("../helpers/fs-exists");
    const update_store_1 = require("../helpers/update-store");
    const validate_bolt_file_1 = require("../helpers/validate-bolt-file");
    const get_ssh_port_1 = require("../helpers/get-ssh-port");
    const fs_remove_folder_1 = require("../helpers/fs-remove-folder");
    const fs_mkdir_1 = require("../helpers/fs-mkdir");
    const download_base_image_1 = require("../helpers/download-base-image");
    const fs_removefile_1 = require("../helpers/fs-removefile");
    const validate_project_status_1 = require("../helpers/validate-project-status");
    const execute_1 = require("../helpers/execute");
    const container_1 = __importDefault(require("../libraries/container"));
    const vm_1 = __importDefault(require("../runners/vm"));
    const bolt_vm_1 = require("../constants/bolt-vm");
    class Create {
        extractDownloadedImage() {
            return __awaiter(this, void 0, void 0, function* () {
                const imagePath = (0, path_1.join)(bolt_vm_1.VM_INTERNALS_PATH, bolt_vm_1.VM_BINARIES.IMAGE_NAME);
                // Create an instance of AdmZip
                const zip = new adm_zip_1.default(imagePath);
                // Extract all files to a specified directory
                zip.extractAllTo(bolt_vm_1.VM_INTERNALS_PATH, true, true);
                // Remove downloaded zip file
                yield (0, fs_removefile_1.removefile)(imagePath);
            });
        }
        checkForBaseImages() {
            return __awaiter(this, void 0, void 0, function* () {
                const alpineImage = bolt_vm_1.VM_BINARIES.ALPINE;
                const varstoreImage = bolt_vm_1.VM_BINARIES.VARSTORE;
                const uefiImage = bolt_vm_1.VM_BINARIES.UEFI;
                const notifyScript = bolt_vm_1.VM_BINARIES.NOTIFY_SCRIPT;
                // Check if images are already downloaded
                if ((yield (0, fs_exists_1.exists)(alpineImage)) &&
                    (yield (0, fs_exists_1.exists)(varstoreImage)) &&
                    (yield (0, fs_exists_1.exists)(uefiImage)) &&
                    (yield (0, fs_exists_1.exists)(notifyScript))) {
                    return;
                }
                console.log(chalk_1.default.yellow(">> Binaries not found or are corrupted!"));
                // Remove .internals folder if exists
                if (yield (0, fs_exists_1.exists)(bolt_vm_1.VM_INTERNALS_PATH)) {
                    console.log(chalk_1.default.yellow(">> Removing corrupted binaries..."));
                    yield (0, fs_remove_folder_1.removeFolder)(bolt_vm_1.VM_INTERNALS_PATH);
                    console.log(chalk_1.default.green(">> Removed corrupted binaries successfully!"));
                }
                // Create .internals folder  folder
                yield (0, fs_mkdir_1.createFolder)(bolt_vm_1.VM_INTERNALS_PATH);
                // Download and extract base images
                console.log(chalk_1.default.yellow(">> Downloading binaries..."));
                yield (0, download_base_image_1.downloadBaseImages)();
                console.log(chalk_1.default.green("\n>> Downloaded binaries successfully!"));
                console.log(chalk_1.default.yellow(">> Extracting downloaded binaries..."));
                yield this.extractDownloadedImage();
                console.log(chalk_1.default.green(">> Binaries extracted successfully!"));
            });
        }
        handle(localPath, cache) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Check for file path exists or not
                    if (!(yield (0, fs_exists_1.exists)(localPath))) {
                        yield (0, exit_with_msg_1.exitWithMsg)(">> Please specify correct path in source!");
                        return;
                    }
                    // Check for base images
                    yield this.checkForBaseImages();
                    // Make notify script executable
                    yield (0, execute_1.execute)("chmod", ["+x", (0, path_1.join)(bolt_vm_1.VM_BINARIES.NOTIFY_SCRIPT)], {});
                    // Check for valid boltvm yml file
                    const boltConfig = yield (0, validate_bolt_file_1.validateBoltYaml)(localPath);
                    const { project_id, project_name } = boltConfig;
                    // Check if image is already built
                    const project = yield (0, validate_project_status_1.validateProjectStatus)("create", boltConfig);
                    // Getting ssh port
                    const sshPort = yield (0, get_ssh_port_1.getSSHPort)();
                    // Create Images for the project
                    const container = new container_1.default(`${project_id}_${project_name}`);
                    const contianerPath = yield container.createImage(cache);
                    // Boot up VM
                    const vmPid = yield vm_1.default.create(localPath, contianerPath, sshPort);
                    // Connect to VM
                    const conn = yield vm_1.default.connect(sshPort);
                    yield conn.end();
                    // Copy files to VM and maintain it with rsync
                    const args = [
                        localPath,
                        bolt_vm_1.VM_INTERNALS_CONFIG.destination,
                        sshPort.toString(),
                    ];
                    const mountPid = yield (0, execute_detached_1.executeDetached)(bolt_vm_1.VM_BINARIES.NOTIFY_SCRIPT, args, {
                        detatched: true,
                    }, "mount");
                    // Adding project to metadata
                    const json = Object.assign(Object.assign({}, project), { containerPath: contianerPath, sshPort: sshPort, status: "up", vmProcessId: vmPid, mountProcessId: mountPid, createdAt: Date.now(), updatedAt: Date.now() });
                    yield (0, update_store_1.updateStore)("projects", project_id, json);
                }
                catch (error) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> Error while creating : ${error.message}`);
                }
            });
        }
    }
    exports.default = Create;
});
