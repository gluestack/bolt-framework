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
Object.defineProperty(exports, "__esModule", { value: true });
const up_1 = require("../up");
const get_store_1 = __importDefault(require("../../helpers/get-store"));
const service_up_1 = require("../service-up");
const deploy_1 = require("../../helpers/deploy/deploy");
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
    getSealContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const _yamlContent = yield (0, up_1.getAndValidateSealYaml)();
            return _yamlContent;
        });
    }
    // populate services
    setServices() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const services = this.services;
            const _yamlContent = yield this.getSealContent();
            try {
                // Gather all the availables services
                for (var _d = true, _e = __asyncValues(Object.entries(_yamlContent.services)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const [serviceName, service] = _c;
                        const { content } = yield (0, service_up_1.getAndValidateService)(serviceName, _yamlContent);
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
            const { zipPath } = yield (0, deploy_1.zip)(cwd);
            this.zipPath = zipPath;
            return Promise.resolve(zipPath);
        });
    }
    // Authenticates users credentials and
    // stores the details into the project's store
    auth(doAuth) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, deploy_1.auth)(doAuth, this.store);
        });
    }
    // uploads the zip into minio
    upload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, deploy_1.upload)(this.zipPath, this.store);
        });
    }
    // watches the deployment steps
    watch() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, deploy_1.watch)(this.store);
        });
    }
}
exports.default = DeployClass;
