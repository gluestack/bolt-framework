var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        define(["require", "exports", "path", "yaml", "../helpers/execute", "@gluestack/helpers", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const yaml = __importStar(require("yaml"));
    const execute_1 = require("../helpers/execute");
    const helpers_1 = require("@gluestack/helpers");
    const chalk_1 = __importDefault(require("chalk"));
    /**
     * Docker Compose
     *
     * This class is responsible for generating the seal.compose.yml file
     */
    class DockerCompose {
        constructor() {
            this.version = "3.9";
            this.services = {};
        }
        // Converts the docker-compose json data to YAML
        toYAML() {
            return yaml.stringify({
                version: this.version,
                services: this.services,
            });
        }
        // Adds a service to the docker-compose file
        pushToService(name, service) {
            this.services[(0, helpers_1.removeSpecialChars)(name)] = service;
        }
        // Generates the docker-compose file
        generate() {
            return __awaiter(this, void 0, void 0, function* () {
                const directory = process.cwd();
                yield (0, helpers_1.writeFile)((0, path_1.join)(directory, "seal.compose.yml"), this.toYAML());
            });
        }
        // Adds the service to the docker-compose file
        addService(projectName, serviceName, path, content) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield (0, helpers_1.fileExists)((0, path_1.join)(path, (content === null || content === void 0 ? void 0 : content.build) || "")))) {
                    return;
                }
                serviceName = (0, helpers_1.removeSpecialChars)(serviceName);
                const bindingPath = (0, path_1.join)(path, "..");
                const service = {
                    container_name: serviceName,
                    restart: "always",
                    build: {
                        context: path,
                        dockerfile: (0, path_1.join)(path, (content === null || content === void 0 ? void 0 : content.build) || ""),
                    },
                };
                if (yield (0, helpers_1.fileExists)((0, path_1.join)(path, ".env"))) {
                    service.env_file = [(0, path_1.join)(path, ".env")];
                }
                if (content === null || content === void 0 ? void 0 : content.healthcheck) {
                    service.healthcheck = content === null || content === void 0 ? void 0 : content.healthcheck;
                }
                if (content === null || content === void 0 ? void 0 : content.depends_on) {
                    service.depends_on = content === null || content === void 0 ? void 0 : content.depends_on;
                }
                if (content === null || content === void 0 ? void 0 : content.ports) {
                    service.ports = content === null || content === void 0 ? void 0 : content.ports;
                }
                if (content === null || content === void 0 ? void 0 : content.volumes) {
                    service.volumes = content === null || content === void 0 ? void 0 : content.volumes.map((volume) => {
                        return volume.split(":")[1]
                            ? `${(0, path_1.join)(process.cwd(), volume.split(":")[0])}:${volume.split(":")[1]}`
                            : volume;
                    });
                }
                this.pushToService(serviceName, service);
            });
        }
        // Adds the nginx service to the docker-compose file
        addNginx(ports) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield (0, helpers_1.fileExists)((0, path_1.join)(process.cwd(), "seal.nginx.conf")))) {
                    return;
                }
                // mapped all the subdomain ports with the nginx container
                const nginx = {
                    container_name: "nginx",
                    restart: "always",
                    build: (0, path_1.join)(__dirname, "..", "templates", "nginx"),
                    volumes: [
                        `${(0, path_1.join)(process.cwd(), "seal.nginx.conf")}:/etc/nginx/nginx.conf`,
                    ],
                };
                if (ports) {
                    nginx.ports = ports.map((port) => `${port}:${port}`);
                }
                this.pushToService("nginx", nginx);
            });
        }
        // Executes the docker-compose up cli
        start(projectName, filepath) {
            return __awaiter(this, void 0, void 0, function* () {
                const args = [
                    "compose",
                    "-p",
                    projectName,
                    "-f",
                    "seal.compose.yml",
                    "up",
                    "--remove-orphans",
                    "-d",
                ];
                this.printCommand(args);
                yield (0, execute_1.execute)("docker", args, {
                    cwd: (0, path_1.join)(filepath),
                    stdio: "inherit",
                    shell: true,
                });
            });
        }
        // Executes the docker-compose down cli
        stop(projectName, filepath) {
            return __awaiter(this, void 0, void 0, function* () {
                const args = [
                    "compose",
                    "-p",
                    projectName,
                    "-f",
                    "seal.compose.yml",
                    "down",
                    "--volumes",
                ];
                this.printCommand(args);
                yield (0, execute_1.execute)("docker", args, {
                    cwd: filepath,
                    stdio: "inherit",
                    shell: true,
                });
            });
        }
        printCommand(args) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.gray("$ docker", args.join(" ")));
            });
        }
    }
    exports.default = DockerCompose;
});
