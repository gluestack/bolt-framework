var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "zod", "../constants/platforms", "../helpers/exit-with-msg", "../constants/bolt-configs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateBoltService = void 0;
    const zod_1 = require("zod");
    const platforms_1 = require("../constants/platforms");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const bolt_configs_1 = require("../constants/bolt-configs");
    const ServiceConfigSchema = zod_1.z.object({
        container_name: zod_1.z.string(),
        default_service_runner: zod_1.z.enum(platforms_1.supportedServiceRunners),
        supported_service_runners: zod_1.z.array(zod_1.z.enum(platforms_1.supportedServiceRunners)),
        service_runners: zod_1.z.record(zod_1.z.enum(platforms_1.hostServiceRunners), zod_1.z.object({
            envfile: zod_1.z.string(),
            build: zod_1.z.string(),
            // context: z.string().optional(),
        })),
    });
    const validateBoltService = (context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield ServiceConfigSchema.parseAsync(context);
        }
        catch (error) {
            // @ts-ignore ZodError
            yield (0, exit_with_msg_1.exitWithMsg)(`Error while validating ${bolt_configs_1.BOLT.SERVICE_YAML_FILE_NAME}: ${error.message}`);
        }
        return context;
    });
    exports.validateBoltService = validateBoltService;
});
