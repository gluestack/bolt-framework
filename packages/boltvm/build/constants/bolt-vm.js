var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "os"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VM_INTERNALS_CONFIG = exports.IMAGE_BUCKET_CONFIGS = exports.SSH_CONFIG = exports.VM_BINARIES = exports.VM_CONFIG = exports.VM_INTERNALS_PATH = exports.BOLTVM = void 0;
    const path_1 = require("path");
    const os_1 = __importDefault(require("os"));
    const homeDir = os_1.default.homedir();
    exports.BOLTVM = {
        METADATA_FOLDER: (0, path_1.join)(".bolt", "boltvm"),
        METADATA_FILE: "metadata.json",
        CONTAINER_FOLDER: "containers",
        SCRIPT_PATH: (0, path_1.join)(__dirname, "../../../../../", "assets", "internals", "scripts", "notify-from-host.sh"),
        LOG_FOLDER: (0, path_1.join)(".logs", "vm"),
    };
    exports.VM_INTERNALS_PATH = (0, path_1.join)(homeDir, exports.BOLTVM.METADATA_FOLDER, ".internals");
    exports.VM_CONFIG = {
        host: "127.0.0.1",
        port: 2222,
        username: "root",
        password: "",
    };
    exports.VM_BINARIES = {
        ALPINE: (0, path_1.join)(exports.VM_INTERNALS_PATH, "alpine.img"),
        UEFI: (0, path_1.join)(exports.VM_INTERNALS_PATH, "QEMU_EFI.img"),
        VARSTORE: (0, path_1.join)(exports.VM_INTERNALS_PATH, "varstore.img"),
        NOTIFY_SCRIPT: (0, path_1.join)(exports.VM_INTERNALS_PATH, "notify-from-host.sh"),
        IMAGE_NAME: "images.zip",
        CONTAINER_IMAGE_NAME: "alpine.img",
    };
    exports.SSH_CONFIG = [
        "-o",
        "StrictHostKeyChecking=accept-new",
        "root@localhost",
    ];
    exports.IMAGE_BUCKET_CONFIGS = {
        cdnEndpoint: "http://static.gluestack.io/bolt/v0.1.0/qemu-images/apple-silicon/images.zip",
    };
    exports.VM_INTERNALS_CONFIG = {
        destination: "/home/boltvm/projects",
        boltInstallationCommand: "sudo npm i -g @gluestack/bolt@latest",
        projectCdCommand: `cd /home/boltvm/projects`,
    };
});
