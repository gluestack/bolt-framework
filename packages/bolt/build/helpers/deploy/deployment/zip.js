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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "archiver", "fs", "../format-bytes", "../file-exists", "readline"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.zip = void 0;
    const path_1 = require("path");
    const archiver_1 = __importDefault(require("archiver"));
    const fs_1 = require("fs");
    const format_bytes_1 = require("../format-bytes");
    const file_exists_1 = require("../file-exists");
    const readline = __importStar(require("readline"));
    const zip = (project_path) => __awaiter(void 0, void 0, void 0, function* () {
        const filename = `${(0, path_1.basename)(process.cwd())}.zip`;
        const directory = (0, path_1.join)(project_path, ".deploy");
        const zipPath = (0, path_1.join)(directory, filename);
        if (!(yield (0, file_exists_1.fileExists)(directory))) {
            (0, fs_1.mkdirSync)(directory, { recursive: true });
        }
        const promise = new Promise((resolve, reject) => {
            // create a file to stream archive data to.
            const output = (0, fs_1.createWriteStream)(zipPath);
            const archive = (0, archiver_1.default)("zip", {
                zlib: { level: 9 }, // Sets the compression level.
            });
            // listen for all archive data to be written
            // 'close' event is fired only when a file descriptor is involved
            output.on("close", () => {
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0);
                process.stdout.write(`>> Compressed ${(0, format_bytes_1.formatBytes)(archive.pointer())} into "${filename}"!`);
                console.log();
                resolve(zipPath);
            });
            archive.on("progress", (progress) => {
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0);
                process.stdout.write(`>> In progress: processed ${progress.entries.processed} files & ${(0, format_bytes_1.formatBytes)(progress.fs.processedBytes)} of data`);
            });
            // good practice to catch warnings (ie stat failures and other non-blocking errors)
            archive.on("warning", (err) => {
                console.log("> Warning:", err);
                if (err.code === "ENOENT") {
                    // log warning
                }
                else {
                    // throw error
                    throw err;
                }
            });
            // This event is fired when the data source is drained no matter what was the data source.
            // It is not part of this library but rather from the NodeJS Stream API.
            // @see: https://nodejs.org/api/stream.html#stream_event_end
            output.on("end", () => {
                console.log("Data has been drained");
            });
            // good practice to catch this error explicitly
            archive.on("error", (err) => {
                reject(err);
            });
            // pipe archive data to the file
            archive.pipe(output);
            // append files from a glob pattern
            archive.glob("**", {
                ignore: [
                    "**/storage/**/data/**",
                    "**/databases/**/db/**",
                    "node_modules/*",
                    "**/node_modules/**",
                    "**/.DS_Store",
                    ".git/**",
                    "**/*.zip",
                    ".deploy",
                    "**/.next/**",
                ],
                cwd: project_path,
                dot: true,
            });
            // finalize the archive (ie we are done appending files but streams have to finish yet)
            // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
            archive.finalize();
        });
        yield Promise.all([promise]);
        return { zipPath };
    });
    exports.zip = zip;
});
