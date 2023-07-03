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
        define(["require", "exports", "path", "../../helpers/execute", "../../helpers/fs-exists", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const execute_1 = require("../../helpers/execute");
    const fs_exists_1 = require("../../helpers/fs-exists");
    const chalk_1 = __importDefault(require("chalk"));
    class ServiceRunnerDocker {
        constructor(container_name, servicePath, build, ports, envfile = "", volumes) {
            this.ports = ports;
            this.container_name = container_name;
            this.build = (0, path_1.join)(servicePath, build);
            this.volume = (0, path_1.join)(servicePath);
            this.envfile = envfile !== "" ? (0, path_1.join)(servicePath, envfile) : "";
            this.volumes = volumes || [];
        }
        create() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(">> Creating Docker Build...");
                const args = [
                    "build",
                    "--no-cache",
                    "-t",
                    this.container_name,
                    "-f",
                    this.build,
                    this.volume,
                ];
                this.printCommand(args);
                yield (0, execute_1.execute)("docker", args, {
                    cwd: this.volume,
                    stdio: "inherit",
                    shell: true,
                });
                console.log(">> Done with Creating Docker Build...");
            });
        }
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(">> Initiaiting Docker Run...");
                const args = [
                    "run",
                    "--detach",
                    "--name",
                    this.container_name,
                    "--hostname",
                    this.container_name,
                ];
                if (this.envfile !== "" && (yield (0, fs_exists_1.exists)(this.envfile))) {
                    args.push("--env-file");
                    args.push(this.envfile);
                }
                if (this.ports.length > 0) {
                    this.ports.forEach((port) => {
                        args.push("-p");
                        args.push(port);
                    });
                }
                if (this.volumes.length > 0) {
                    this.volumes.forEach((volume) => {
                        const v = volume.split(":")[1]
                            ? `${(0, path_1.join)(process.cwd(), volume.split(":")[0])}:${volume.split(":")[1]}`
                            : volume;
                        args.push("-v");
                        args.push(v);
                    });
                }
                args.push(this.container_name);
                this.printCommand(args);
                yield (0, execute_1.execute)("docker", args, {
                    cwd: this.volume,
                    stdio: "inherit",
                    shell: true,
                });
                console.log(">> Done with Initiating Docker Run...");
            });
        }
        stopExec() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(">> Stopping Docker Container...");
                const args = ["stop", this.container_name];
                this.printCommand(args);
                yield (0, execute_1.execute)("docker", args, {
                    cwd: this.volume,
                    stdio: "inherit",
                    shell: true,
                });
                console.log(">> Done with Stopping Docker Container...");
            });
        }
        remove() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(">> Removing Docker Container...");
                const args = ["rm", this.container_name];
                this.printCommand(args);
                yield (0, execute_1.execute)("docker", args, {
                    cwd: this.volume,
                    stdio: "inherit",
                    shell: true,
                });
                console.log(">> Done with Removing Docker Container...");
            });
        }
        printCommand(args) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.gray("$ docker", args.join(" ")));
            });
        }
        getLog(isFollow) {
            return __awaiter(this, void 0, void 0, function* () {
                const args = isFollow
                    ? ["logs", "--follow", this.container_name]
                    : ["logs", this.container_name];
                this.printCommand(args);
                yield (0, execute_1.execute)("docker", args, {
                    stdio: "inherit",
                    shell: true,
                });
            });
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.create();
                yield this.run();
            });
        }
        stop() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.stopExec();
                yield this.remove();
            });
        }
        logs(isFollow) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.getLog(isFollow);
            });
        }
    }
    exports.default = ServiceRunnerDocker;
});
