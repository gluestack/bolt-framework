"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const chalk_1 = __importDefault(require("chalk"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const execute_detached_1 = require("../helpers/execute-detached");
const exit_with_msg_1 = require("../helpers/exit-with-msg");
const fs_exists_1 = require("../helpers/fs-exists");
const update_store_1 = require("../helpers/update-store");
const validate_seal_file_1 = require("../helpers/validate-seal-file");
const get_ssh_port_1 = require("../helpers/get-ssh-port");
const fs_remove_folder_1 = require("../helpers/fs-remove-folder");
const fs_mkdir_1 = require("../helpers/fs-mkdir");
const download_base_image_1 = require("../helpers/download-base-image");
const fs_removefile_1 = require("../helpers/fs-removefile");
const validate_project_status_1 = require("../helpers/validate-project-status");
const execute_1 = require("../helpers/execute");
const container_1 = __importDefault(require("../libraries/container"));
const vm_1 = __importDefault(require("../runners/vm"));
const constants_1 = require("../constants");
function extractDownloadedImage() {
    return __awaiter(this, void 0, void 0, function* () {
        const imagePath = (0, path_1.join)(constants_1.VM_INTERNALS_PATH, constants_1.VM_BINARIES.IMAGE_NAME);
        // Create an instance of AdmZip
        const zip = new adm_zip_1.default(imagePath);
        // Extract all files to a specified directory
        zip.extractAllTo(constants_1.VM_INTERNALS_PATH, true, true);
        // Remove downloaded zip file
        yield (0, fs_removefile_1.removefile)(imagePath);
        return;
    });
}
function checkForBaseImages() {
    return __awaiter(this, void 0, void 0, function* () {
        const alpineImage = constants_1.VM_BINARIES.ALPINE;
        const varstoreImage = constants_1.VM_BINARIES.VARSTORE;
        const uefiImage = constants_1.VM_BINARIES.UEFI;
        const notifyScript = constants_1.VM_BINARIES.NOTIFY_SCRIPT;
        // Check if images are already downloaded
        if ((yield (0, fs_exists_1.exists)(alpineImage)) &&
            (yield (0, fs_exists_1.exists)(varstoreImage)) &&
            (yield (0, fs_exists_1.exists)(uefiImage)) &&
            (yield (0, fs_exists_1.exists)(notifyScript))) {
            return;
        }
        console.log(chalk_1.default.yellow(">> Binaries not found or corrupted !!!\n"));
        // Remove .internals folder if exists
        if (yield (0, fs_exists_1.exists)(constants_1.VM_INTERNALS_PATH)) {
            yield (0, fs_remove_folder_1.removeFolder)(constants_1.VM_INTERNALS_PATH);
        }
        // Create .internals folder  folder
        yield (0, fs_mkdir_1.createFolder)(constants_1.VM_INTERNALS_PATH);
        // Download and extract base images
        console.log(chalk_1.default.yellow(">> Downloading Binaries..."));
        yield (0, download_base_image_1.downloadBaseImages)();
        console.log(chalk_1.default.green("\n>> Binaries Downloaded successfully!\n"));
        console.log(chalk_1.default.yellow(">> Extracting downloaded binaries..."));
        yield extractDownloadedImage();
        console.log(chalk_1.default.green(">> Binaries extracted successfully! \n"));
        return;
    });
}
exports.default = (localPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        localPath =
            localPath === "." ? process.cwd() : (0, path_1.join)(process.cwd(), localPath);
        // Check for file path exists or not
        if (!(yield (0, fs_exists_1.exists)(localPath))) {
            (0, exit_with_msg_1.exitWithMsg)(">> Please specify correct path to initialize");
            return;
        }
        // Check for base images
        yield checkForBaseImages();
        yield (0, execute_1.execute)("chmod", ["+x", (0, path_1.join)(constants_1.VM_BINARIES.NOTIFY_SCRIPT)], {});
        // Check for valid sealvm yml file
        const sealConfig = yield (0, validate_seal_file_1.validateSealFile)(localPath);
        // Check if image is already built
        const project = yield (0, validate_project_status_1.validateProjectStatus)(sealConfig.name, "create");
        // Getting ssh port
        const sshPort = yield (0, get_ssh_port_1.getSSHPort)();
        // Create Images for the project
        const container = new container_1.default(sealConfig.name);
        const contianerPath = yield container.createImage();
        // Boot up VM
        const vmPid = yield vm_1.default.create(localPath, contianerPath, sshPort);
        // Connect to VM
        const conn = yield vm_1.default.connect();
        yield conn.end();
        // Copy files to VM and maintain it with rsync
        const args = [localPath, sealConfig.destination];
        const mountPid = yield (0, execute_detached_1.executeDetached)(constants_1.VM_BINARIES.NOTIFY_SCRIPT, args, {
            detatched: true,
        });
        // Adding project to metadata
        const json = Object.assign(Object.assign({}, project), { containerPath: contianerPath, sshPort: sshPort, status: "build", vmProcessId: vmPid, mountProcessId: mountPid, createdAt: Date.now(), updatedAt: Date.now() });
        yield (0, update_store_1.updateStore)("projects", sealConfig.name, json);
    }
    catch (err) {
        console.log(err);
        (0, exit_with_msg_1.exitWithMsg)(">> Error while creating : ", err.message);
    }
});
