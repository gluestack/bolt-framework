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
        define(["require", "exports", "./actions/addMetadata", "./actions/create", "./actions/doctor", "./actions/down", "./actions/exec", "./actions/exposePort", "./actions/log", "./actions/run", "./actions/status"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const addMetadata_1 = __importDefault(require("./actions/addMetadata"));
    const create_1 = __importDefault(require("./actions/create"));
    const doctor_1 = __importDefault(require("./actions/doctor"));
    const down_1 = __importDefault(require("./actions/down"));
    const exec_1 = __importDefault(require("./actions/exec"));
    const exposePort_1 = __importDefault(require("./actions/exposePort"));
    const log_1 = __importDefault(require("./actions/log"));
    const run_1 = __importDefault(require("./actions/run"));
    const status_1 = __importDefault(require("./actions/status"));
    class BoltVm {
        constructor(location) {
            this.location = location;
        }
        addMetadata() {
            return __awaiter(this, void 0, void 0, function* () {
                const addMetadata = new addMetadata_1.default();
                yield addMetadata.handle(this.location);
            });
        }
        create(cache) {
            return __awaiter(this, void 0, void 0, function* () {
                const create = new create_1.default();
                yield create.handle(this.location, cache);
            });
        }
        run(command, detached) {
            return __awaiter(this, void 0, void 0, function* () {
                const run = new run_1.default();
                yield run.handle(command, this.location, detached);
            });
        }
        exposePort(port) {
            return __awaiter(this, void 0, void 0, function* () {
                const exposePort = new exposePort_1.default();
                yield exposePort.handle(this.location, port);
            });
        }
        exec() {
            return __awaiter(this, void 0, void 0, function* () {
                const exec = new exec_1.default();
                yield exec.handle(this.location);
            });
        }
        log(isFollow) {
            return __awaiter(this, void 0, void 0, function* () {
                const log = new log_1.default();
                yield log.handle(this.location, isFollow);
            });
        }
        down() {
            return __awaiter(this, void 0, void 0, function* () {
                const down = new down_1.default();
                yield down.handle(this.location);
            });
        }
        status() {
            return __awaiter(this, void 0, void 0, function* () {
                const status = new status_1.default();
                yield status.handle(this.location);
            });
        }
        doctor() {
            return __awaiter(this, void 0, void 0, function* () {
                const doctor = new doctor_1.default();
                yield doctor.handle();
            });
        }
    }
    exports.default = BoltVm;
});
