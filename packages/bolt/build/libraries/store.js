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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "path", "os"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs = __importStar(require("fs"));
    const $path = __importStar(require("path"));
    const os = __importStar(require("os"));
    class Store {
        constructor(path) {
            this.path = path;
            this.store = {};
        }
        restore() {
            try {
                if (fs.existsSync($path.dirname(this.path))) {
                    const data = fs.readFileSync(this.path, "utf8");
                    if (data) {
                        this.store = JSON.parse(data);
                    }
                }
            }
            catch (error) {
                //
            }
        }
        set(key, value) {
            this.store[key] = value;
        }
        get(key) {
            return this.store[key];
        }
        save() {
            try {
                if (!fs.existsSync($path.dirname(this.path))) {
                    fs.mkdirSync($path.dirname(this.path), { recursive: true });
                }
                fs.writeFileSync(this.path, JSON.stringify(this.store, null, 2) + os.EOL);
            }
            catch (error) {
                //
            }
        }
    }
    exports.default = Store;
});
