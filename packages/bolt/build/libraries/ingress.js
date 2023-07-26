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
        define(["require", "exports", "os", "chalk", "../helpers/execute", "../runners/service/docker"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const os_1 = __importDefault(require("os"));
    const chalk_1 = __importDefault(require("chalk"));
    const execute_1 = require("../helpers/execute");
    const docker_1 = __importDefault(require("../runners/service/docker"));
    class Ingress {
        static removeIfExist(containerName) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.green(`>> Removing ${containerName} if exists...`));
                const args = ["rm", "-f", containerName, "2>/dev/null", "||", "true"];
                yield (0, execute_1.execute)("docker", args, {
                    stdio: "inherit",
                    shell: true,
                });
            });
        }
        static start(containerName, ports, volume, image) {
            return __awaiter(this, void 0, void 0, function* () {
                const opsys = os_1.default.platform();
                const addHost = opsys === "linux" ? ["--network", "host"] : null;
                const args = [
                    "run",
                    "-d",
                    "--name",
                    containerName,
                    "-v",
                    volume,
                    "--rm",
                ];
                if (addHost) {
                    args.push(...addHost);
                }
                if (ports.length > 0) {
                    ports.forEach((port) => {
                        args.push("-p");
                        args.push(`${port}:${port}`);
                    });
                }
                args.push(image);
                yield Ingress.removeIfExist(containerName);
                console.log(">> Running boltingress");
                yield (0, execute_1.execute)("docker", args, {
                    stdio: "inherit",
                    shell: true,
                });
            });
        }
        static stop(containerName) {
            return __awaiter(this, void 0, void 0, function* () {
                const docker = new docker_1.default("", containerName, "", "", []);
                yield docker.stopExec();
                yield docker.remove();
            });
        }
    }
    exports.default = Ingress;
});
