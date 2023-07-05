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
        define(["require", "exports", "../../package.json", "chalk", "lodash", "path", "commander", "fs/promises", "closest-match", "../helpers/fs-exists", "../constants/bolt-configs"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @ts-ignore
    const package_json_1 = __importDefault(require("../../package.json"));
    const chalk_1 = __importDefault(require("chalk"));
    const lodash_1 = require("lodash");
    const path = __importStar(require("path"));
    const commander_1 = require("commander");
    const promises_1 = require("fs/promises");
    const closest_match_1 = require("closest-match");
    const fs_exists_1 = require("../helpers/fs-exists");
    const bolt_configs_1 = require("../constants/bolt-configs");
    class Commander {
        constructor() {
            this.cwd = process.cwd();
            this.program = new commander_1.Command();
        }
        static register() {
            return __awaiter(this, void 0, void 0, function* () {
                const command = new Commander();
                yield command.init();
                yield command.addCommands();
                yield command.close();
            });
        }
        init() {
            return __awaiter(this, void 0, void 0, function* () {
                this.program
                    .name("bolt")
                    .version(`bolt Run Version v${package_json_1.default.version}`)
                    .description(`bolt CLI tool v${package_json_1.default.version}`);
            });
        }
        addCommands() {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                var _d;
                const files = yield (0, promises_1.readdir)(path.join(__dirname, "..", "commands"));
                const _boltYamlPath = yield (0, fs_exists_1.exists)(path.join(process.cwd(), bolt_configs_1.BOLT.YAML_FILE_NAME));
                files.sort((a, b) => {
                    var _a, _b;
                    const aNum = parseInt(((_a = a.match(/^\d+/)) !== null && _a !== void 0 ? _a : [""])[0]);
                    const bNum = parseInt(((_b = b.match(/^\d+/)) !== null && _b !== void 0 ? _b : [""])[0]);
                    return aNum - bNum;
                });
                try {
                    for (var _e = true, files_1 = __asyncValues(files), files_1_1; files_1_1 = yield files_1.next(), _a = files_1_1.done, !_a;) {
                        _c = files_1_1.value;
                        _e = false;
                        try {
                            const file = _c;
                            if (!file.endsWith(".js")) {
                                continue;
                            }
                            const commandNo = parseInt(file.split("-")[0]);
                            if (!_boltYamlPath && commandNo > 1) {
                                continue;
                            }
                            const commands = yield (_d = "../commands/" + file.replace(".js", ""), __syncRequire ? Promise.resolve().then(() => __importStar(require(_d))) : new Promise((resolve_1, reject_1) => { require([_d], resolve_1, reject_1); }).then(__importStar));
                            commands.default(this.program);
                        }
                        finally {
                            _e = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_e && !_a && (_b = files_1.return)) yield _b.call(files_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
        }
        close() {
            return __awaiter(this, void 0, void 0, function* () {
                this.program.on("command:*", () => {
                    const cmd = this.program.args[0];
                    const cmds = (0, lodash_1.map)(this.program.commands, "_name").concat("help");
                    const closestCommand = (0, closest_match_1.closestMatch)(cmd, cmds);
                    //@ts-ignore
                    this.program.args[0] = closestCommand;
                    const cmdWithArgs = this.program.args.join(" ");
                    console.log(chalk_1.default.redBright(`\nUnknown command: "${cmd}".`), chalk_1.default.cyanBright(`Did you mean "${closestCommand}"?`), chalk_1.default.bgBlack(`\n$ bolt ${cmdWithArgs}`), chalk_1.default.italic(chalk_1.default.magentaBright("\nUse --help for list of available commands\n")));
                    process.exit(1);
                });
                this.program.parseAsync();
            });
        }
    }
    exports.default = Commander;
});
