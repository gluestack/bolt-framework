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
        define(["require", "exports", "../../helpers/get-store", "../../helpers/deploy/deployment", "../../common"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const get_store_1 = __importDefault(require("../../helpers/get-store"));
    const deployment_1 = require("../../helpers/deploy/deployment");
    const common_1 = __importDefault(require("../../common"));
    class DeployClass {
        constructor() {
            this.zipPath = "";
            this.services = [];
            this.cwd = process.cwd();
            //
        }
        setStore() {
            return __awaiter(this, void 0, void 0, function* () {
                this.store = yield (0, get_store_1.default)();
            });
        }
        saveStore() {
            return __awaiter(this, void 0, void 0, function* () {
                this.store.save();
            });
        }
        getBoltFileContent() {
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                return _yamlContent;
            });
        }
        // populate services
        setServices() {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                const services = this.services;
                const _yamlContent = yield this.getBoltFileContent();
                try {
                    // Gather all the availables services
                    for (var _d = true, _e = __asyncValues(Object.entries(_yamlContent.services)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            const [serviceName] = _c;
                            const { content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                            services.push(content);
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                this.services = services;
            });
        }
        // Create project zip file ignoring unnecessary files
        createZip() {
            return __awaiter(this, void 0, void 0, function* () {
                const cwd = this.cwd;
                const { zipPath } = yield (0, deployment_1.zip)(cwd);
                this.zipPath = zipPath;
                return Promise.resolve(zipPath);
            });
        }
        auth(doAuth) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, deployment_1.auth)(doAuth, this.store);
            });
        }
        setProject(projects) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, deployment_1.setProject)(projects);
            });
        }
        // uploads the zip into minio
        upload() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, deployment_1.upload)(this.zipPath, this.store);
            });
        }
        submit({ projectId, fileId, userId, }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, deployment_1.deploy)({
                    projectId,
                    fileId,
                    userId,
                });
            });
        }
        // watches the deployment steps
        watch() {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, deployment_1.watch)(this.store);
            });
        }
    }
    exports.default = DeployClass;
});
