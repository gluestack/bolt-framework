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
exports.getDockerStatus = void 0;
const child_process_1 = require("child_process");
const path_1 = require("path");
const os_1 = __importDefault(require("os"));
const fs_writefile_1 = require("./fs-writefile");
const getDockerInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)("docker", ["info"]);
        child.stderr.on("data", (data) => {
            console.log(data.toString());
        });
        child.on("exit", (code) => {
            code === 0 ? resolve(true) : resolve(false);
        });
    });
});
const updateDockerInfo = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dockerStatus = yield getDockerInfo();
    const data = JSON.stringify({
        running: dockerStatus,
        lastUpdated: Date.now(),
    });
    yield (0, fs_writefile_1.writefile)(filePath, data);
    return dockerStatus;
});
const getDockerStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const dockerInfoPath = (0, path_1.join)(os_1.default.homedir(), ".seal", "docker-info.json");
    const status = yield updateDockerInfo(dockerInfoPath);
    return status;
});
exports.getDockerStatus = getDockerStatus;
