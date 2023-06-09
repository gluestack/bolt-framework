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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = require("path");
const validate_seal_file_1 = require("../helpers/validate-seal-file");
const validate_project_status_1 = require("../helpers/validate-project-status");
function default_1(localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        localPath =
            localPath === "." ? process.cwd() : (0, path_1.join)(process.cwd(), localPath);
        // Check for valid sealvm yml file
        const sealConfig = yield (0, validate_seal_file_1.validateSealFile)(localPath);
        // Check if project has been created
        const project = yield (0, validate_project_status_1.validateProjectStatus)(sealConfig.name, "status");
        const status = project.status;
        switch (status) {
            case "build":
                console.log(chalk_1.default.green(`>> ${sealConfig.name}'s image has been build on sealvm. `));
                break;
            case "up":
                console.log(chalk_1.default.green(`>> ${sealConfig.name} is up & running on sealvm. `));
                break;
            case "down":
                console.log(chalk_1.default.green(`>> ${sealConfig.name} is down. `));
                break;
            default:
                console.log(chalk_1.default.green(`>> ${sealConfig.name} has unknown status. ${status} `));
                break;
        }
    });
}
exports.default = default_1;
