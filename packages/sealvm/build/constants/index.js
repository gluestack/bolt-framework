"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGE_BUCKET_CONFIGS = exports.VM_CONFIG = exports.YAMLDATA = exports.VM_BINARIES = exports.VM_INTERNALS_PATH = exports.SEALVM = void 0;
const path_1 = require("path");
const os_1 = __importDefault(require("os"));
const homeDir = os_1.default.homedir();
exports.SEALVM = {
    CONFIG_FILE: "sealvm.yml",
    METADATA_FOLDER: ".sealvm",
    METADATA_FILE: "metadata.json",
    CONTAINER_FOLDER: "containers",
    SCRIPT_PATH: (0, path_1.join)(__dirname, "../../../../../", "assets", "internals", "scripts", "notify-from-host.sh"),
};
exports.VM_INTERNALS_PATH = (0, path_1.join)(homeDir, exports.SEALVM.METADATA_FOLDER, ".internals");
exports.VM_BINARIES = {
    ALPINE: (0, path_1.join)(exports.VM_INTERNALS_PATH, "alpine.img"),
    UEFI: (0, path_1.join)(exports.VM_INTERNALS_PATH, "QEMU_EFI.img"),
    VARSTORE: (0, path_1.join)(exports.VM_INTERNALS_PATH, "varstore.img"),
    NOTIFY_SCRIPT: (0, path_1.join)(exports.VM_INTERNALS_PATH, "notify-from-host.sh"),
    IMAGE_NAME: "images.zip",
};
exports.YAMLDATA = {
    destination: "/home/sealvm/projects",
    ports: ["3000:3000"],
    command: "seal up",
};
exports.VM_CONFIG = {
    host: "127.0.0.1",
    port: 2222,
    username: "sealvm",
    password: "",
};
exports.IMAGE_BUCKET_CONFIGS = {
    endpoint: "https://sfo3.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
        accessKeyId: "DO00D9RH8GBGWTX84BDF",
        secretAccessKey: "POQYyFYPCNp7MtvDJtnO1s12CuoMgURmt3B4sz6BS3k",
    },
};
