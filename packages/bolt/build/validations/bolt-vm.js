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
    exports.validateVmConfig = void 0;
    const zod_1 = require("zod");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const ConfigSchema = zod_1.z.object({
        name: zod_1.z.string(),
        ports: zod_1.z.array(zod_1.z.string()),
        command: zod_1.z.string(),
    });
    const validateVmConfig = (context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield ConfigSchema.parseAsync(context);
        }
        catch (error) {
            // @ts-ignore ZodError
            yield (0, exit_with_msg_1.exitWithMsg)(`Error while validating VM configuration:\n ${JSON.stringify(Object.assign({}, error.errors), null, 2)}`);
        }
        return context;
    });
    exports.validateVmConfig = validateVmConfig;
});
