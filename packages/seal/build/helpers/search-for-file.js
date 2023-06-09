"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function searchForFile(rootPath, fileName) {
    try {
        const files = (0, fs_1.readdirSync)(rootPath);
        for (const file of files) {
            try {
                const filePath = (0, path_1.join)(rootPath, file);
                if ((0, fs_1.statSync)(filePath).isDirectory()) {
                    const result = searchForFile(filePath, fileName);
                    if (result) {
                        return result;
                    }
                }
                else if (file === fileName) {
                    return filePath;
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
exports.default = searchForFile;
