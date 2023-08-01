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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
        define(["require", "exports", "net", "../helpers/exit-with-msg", "chalk", "../helpers/update-store", "../helpers/get-store-data", "@gluestack/helpers", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const net = __importStar(require("net"));
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const chalk_1 = __importDefault(require("chalk"));
    const update_store_1 = require("../helpers/update-store");
    const get_store_data_1 = require("../helpers/get-store-data");
    const helpers_1 = require("@gluestack/helpers");
    const path_1 = require("path");
    class ServiceDiscovery {
        constructor(serviceContent) {
            this.serviceContent = serviceContent;
        }
        isPortUsed(port) {
            return new Promise((resolve) => {
                const socket = new net.Socket();
                const onError = (e) => {
                    socket.destroy();
                    return resolve(false);
                };
                socket.once("error", onError);
                socket.connect(port, "localhost", () => {
                    socket.end();
                    return resolve(true);
                });
            });
        }
        findAvailablePort(basePort, maxRetries) {
            return __awaiter(this, void 0, void 0, function* () {
                let port = basePort;
                let retries = 0;
                const storedPorts = (yield (0, get_store_data_1.getStoreData)("ports")) || [];
                while (retries < maxRetries) {
                    if (storedPorts.includes(port.toString())) {
                        console.log(`>> ${chalk_1.default.yellow(port)} Port is already in use. Retrying with ${chalk_1.default.green(port + 1)}`);
                        port++;
                        continue;
                    }
                    const portInUse = yield this.isPortUsed(port);
                    if (!portInUse) {
                        (0, update_store_1.updateStoreRootData)("ports", [...storedPorts, port.toString()]);
                        return port;
                    }
                    console.log(`>> ${chalk_1.default.yellow(port)} Port is already in use. Retrying with ${chalk_1.default.green(port + 1)}`);
                    port++;
                    retries++;
                }
                yield (0, exit_with_msg_1.exitWithMsg)(`Max retries (${maxRetries}) exceeded. Unable to find an available port.`);
                return 0;
            });
        }
        discoverPort(serviceName) {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                const ports = this.serviceContent.service_discovery_offset;
                const otherPorts = ports.slice(1);
                const assignedPort = yield this.findAvailablePort(ports[0], 5);
                let otherAssignedPorts = [];
                try {
                    for (var _d = true, otherPorts_1 = __asyncValues(otherPorts), otherPorts_1_1; otherPorts_1_1 = yield otherPorts_1.next(), _a = otherPorts_1_1.done, !_a;) {
                        _c = otherPorts_1_1.value;
                        _d = false;
                        try {
                            const port = _c;
                            const currentAssignedPort = yield this.findAvailablePort(port, 5);
                            otherAssignedPorts.push(currentAssignedPort);
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = otherPorts_1.return)) yield _b.call(otherPorts_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return [assignedPort, ...otherAssignedPorts];
            });
        }
        static discoverProductionHost(servicePath) {
            var _a, e_2, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                const regex = /%(\w+)_ASSIGNED_HOST%/g;
                const envTplContent = yield (0, helpers_1.envToJson)((0, path_1.join)(servicePath, ".env.tpl"));
                let envContent = {};
                try {
                    for (var _d = true, _e = __asyncValues(Object.keys(envTplContent)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            const key = _c;
                            if (envTplContent[key].match(regex)) {
                                envContent[`${key}`] = envTplContent[key].replace(regex, "{{$1_ASSIGNED_HOST}}");
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return envContent;
            });
        }
    }
    exports.default = ServiceDiscovery;
});
