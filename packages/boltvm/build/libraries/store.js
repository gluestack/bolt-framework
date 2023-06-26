(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "os", "path", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const os_1 = require("os");
    const path_1 = require("path");
    const fs_1 = require("fs");
    class Store {
        constructor(path) {
            this.path = path;
            this.store = {};
        }
        restore() {
            try {
                if ((0, fs_1.existsSync)((0, path_1.dirname)(this.path))) {
                    const data = (0, fs_1.readFileSync)(this.path, 'utf8');
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
                if (!(0, fs_1.existsSync)((0, path_1.dirname)(this.path))) {
                    (0, fs_1.mkdirSync)((0, path_1.dirname)(this.path), { recursive: true });
                }
                (0, fs_1.writeFileSync)(this.path, JSON.stringify(this.store, null, 2) + os_1.EOL);
            }
            catch (error) {
                //
            }
        }
    }
    exports.default = Store;
});
