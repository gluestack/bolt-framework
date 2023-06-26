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
        define(["require", "exports", "zod", "../helpers/exit-with-msg"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateBolt = void 0;
    const zod_1 = require("zod");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const ConfigSchema = zod_1.z.object({
        envfile: zod_1.z.string(),
        project_id: zod_1.z.string(),
        project_name: zod_1.z.string(),
        default_project_runner: zod_1.z.string(),
        default_service_runner: zod_1.z.string(),
        services: zod_1.z.nullable(zod_1.z.record(zod_1.z.string(), zod_1.z.object({
            path: zod_1.z.string(),
        }))),
    });
    const validateBolt = (context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield ConfigSchema.parseAsync(context);
        }
        catch (error) {
            // @ts-ignore ZodError
            yield (0, exit_with_msg_1.exitWithMsg)(JSON.stringify(Object.assign({}, error.errors), null, 2));
        }
        return context;
    });
    exports.validateBolt = validateBolt;
});
