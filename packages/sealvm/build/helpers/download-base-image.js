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
        define(["require", "exports", "progress-stream", "fs", "@aws-sdk/client-s3", "chalk", "path", "../constants", "./exit-with-msg"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.downloadBaseImages = void 0;
    const progress_stream_1 = __importDefault(require("progress-stream"));
    const fs_1 = require("fs");
    const client_s3_1 = require("@aws-sdk/client-s3");
    const chalk_1 = __importDefault(require("chalk"));
    const path_1 = require("path");
    const constants_1 = require("../constants");
    const exit_with_msg_1 = require("./exit-with-msg");
    const downloadBaseImages = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (((_a = constants_1.IMAGE_BUCKET_CONFIGS === null || constants_1.IMAGE_BUCKET_CONFIGS === void 0 ? void 0 : constants_1.IMAGE_BUCKET_CONFIGS.credentials) === null || _a === void 0 ? void 0 : _a.accessKeyId) === "" ||
            ((_b = constants_1.IMAGE_BUCKET_CONFIGS === null || constants_1.IMAGE_BUCKET_CONFIGS === void 0 ? void 0 : constants_1.IMAGE_BUCKET_CONFIGS.credentials) === null || _b === void 0 ? void 0 : _b.secretAccessKey) === "") {
            (0, exit_with_msg_1.exitWithMsg)(">> AWS credentials are missing!");
        }
        const s3Client = new client_s3_1.S3(Object.assign({ forcePathStyle: false }, constants_1.IMAGE_BUCKET_CONFIGS));
        // Specifies a path within your bucket and the file to download.
        const bucketParams = {
            Bucket: "seal-assets",
            Key: "arch64-alpine/images.zip",
        };
        // Downloads your file and saves its contents to /tmp/local-file.ext.
        try {
            const response = yield s3Client.send(new client_s3_1.GetObjectCommand(bucketParams));
            const contentLength = response.ContentLength;
            const progressStream = (0, progress_stream_1.default)({
                length: contentLength,
                time: 1000, // Emit progress event every second
            });
            // Create a write stream to save the file locally
            const fileStream = (0, fs_1.createWriteStream)((0, path_1.join)(constants_1.VM_INTERNALS_PATH, constants_1.VM_BINARIES.IMAGE_NAME));
            // Listen to progress events
            progressStream.on("progress", (progress) => {
                let transferredSize;
                let lengthSize;
                const percent = Math.round(progress.percentage);
                if (progress.transferred >= 1024 * 1024 * 1000) {
                    transferredSize = `${(progress.transferred / (1024 * 1024 * 1024)).toFixed(2)} GB`;
                    lengthSize = `${(progress.length / (1024 * 1024 * 1024)).toFixed(2)} GB`;
                }
                else {
                    transferredSize = `${(progress.transferred / (1024 * 1024)).toFixed(2)} MB`;
                    lengthSize = `${(progress.length / (1024 * 1024)).toFixed(2)} MB`;
                }
                process.stdout.clearLine(1);
                process.stdout.cursorTo(0);
                process.stdout.write(chalk_1.default.yellow(`\r>> Downloaded: ${transferredSize} / ${lengthSize} - ${percent}%`));
            });
            if (response.Body) {
                // Pipe the response body to the progress stream and then to the file stream
                response.Body.pipe(progressStream).pipe(fileStream);
            }
            // Wait for the file to be downloaded and saved
            yield new Promise((resolve, reject) => {
                fileStream.on("finish", resolve);
                fileStream.on("error", (err) => {
                    (0, exit_with_msg_1.exitWithMsg)("Something went wrong while downloading base images");
                });
            });
        }
        catch (err) {
            console.log("Error", err);
        }
    });
    exports.downloadBaseImages = downloadBaseImages;
});
