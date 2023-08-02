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
        define(["require", "exports", "chalk", "../../actions/env-generate", "../../helpers/validate-metadata", "../../helpers/validate-services", "../route-generate", "./deploy"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const env_generate_1 = __importDefault(require("../../actions/env-generate"));
    const validate_metadata_1 = require("../../helpers/validate-metadata");
    const validate_services_1 = require("../../helpers/validate-services");
    const route_generate_1 = __importDefault(require("../route-generate"));
    const deploy_1 = __importDefault(require("./deploy"));
    exports.default = (options, isWatch = false) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(chalk_1.default.gray(">> Building Production Envs..."));
        const envGenerate = new env_generate_1.default();
        yield envGenerate.handle({ environment: "production" });
        const routeGenerate = new route_generate_1.default();
        yield routeGenerate.handle(true);
        return;
        // validate the project
        console.log(">> Validating project...");
        yield (0, validate_metadata_1.validateMetadata)();
        yield (0, validate_services_1.validateServices)();
        console.log("\n> Note: Please remove any zip file or unnecessary files/folders from your project before deploying!");
        console.log("\n> Deploying project...");
        const deploy = new deploy_1.default();
        console.log("\n> Gathering all deployable services...");
        // populate store
        yield deploy.setStore();
        // populate services
        yield deploy.setServices();
        // Showcase the services that are going to be deployed
        console.log(">> Found %d deployable services...\n", deploy.services.length);
        if (!deploy.services.length) {
            console.log(">> No services found! Please run glue build and try again!");
            process.exit(1);
        }
        // Create project's zip file
        console.log(">> Compressing the project...");
        yield deploy.createZip();
        // authenticate the user & store creds in local store
        console.log("\n>> Authenticating user credentials...");
        yield deploy.auth(options.auth);
        console.log(">> Authentication successful!\n");
        // uploads the project zip file to minio
        console.log(">> Uploading project zip file...");
        yield deploy.upload();
        console.log(">> Project zip file uploaded successfully!\n");
        // save store
        yield deploy.saveStore();
        if (isWatch) {
            console.log(">> Fetching deployment details...\n");
            yield deploy.watch();
        }
    });
});
