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
        define(["require", "exports", "../libraries/service-discovery"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const service_discovery_1 = __importDefault(require("../libraries/service-discovery"));
    class PortDiscovery {
        constructor(serviceContent) {
            this.serviceContent = serviceContent;
        }
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                const serviceDiscovery = new service_discovery_1.default(this.serviceContent);
                const ports = yield serviceDiscovery.discoverPort();
                this.serviceContent.service_discovery_offset = ports;
                const portEnvTplJson = {};
                ports.forEach((port, index) => {
                    if (!index) {
                        portEnvTplJson["ASSIGNED_PORT"] = `${port}`;
                        return;
                    }
                    portEnvTplJson[`ASSIGNED_PORT_${index}`] = `${port}`;
                    return;
                });
                return {
                    ports: portEnvTplJson,
                    serviceName: this.serviceContent.container_name,
                };
            });
        }
        production() {
            return __awaiter(this, void 0, void 0, function* () {
                const portEnvTplJson = {};
                for (const [index, port,] of this.serviceContent.service_discovery_offset.entries()) {
                    if (!index) {
                        portEnvTplJson["ASSIGNED_PORT"] = `${port}`;
                        continue;
                    }
                    portEnvTplJson[`ASSIGNED_PORT_${index}`] = `${port}`;
                }
                return {
                    ports: portEnvTplJson,
                    serviceName: this.serviceContent.container_name,
                };
            });
        }
    }
    exports.default = PortDiscovery;
});
