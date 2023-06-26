(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const fs_1 = require("fs");
    function searchForFolder(rootPath, folderName) {
        try {
            const files = (0, fs_1.readdirSync)(rootPath);
            for (const file of files) {
                try {
                    const filePath = (0, path_1.join)(rootPath, file);
                    if ((0, fs_1.statSync)(filePath).isDirectory()) {
                        if (file === folderName) {
                            return filePath;
                        }
                        const result = searchForFolder(filePath, folderName);
                        if (result) {
                            return result;
                        }
                    }
                }
                catch (e) {
                    //
                }
            }
        }
        catch (e) {
            //
        }
        return undefined;
    }
    exports.default = searchForFolder;
});
