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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSealService = void 0;
const zod_1 = require("zod");
const platforms_1 = require("../constants/platforms");
const exit_with_msg_1 = require("../helpers/exit-with-msg");
const ServiceConfigSchema = zod_1.z.object({
    container_name: zod_1.z.string(),
    platforms: zod_1.z.record(zod_1.z.enum(platforms_1.platforms), zod_1.z.object({
        envfile: zod_1.z.string(),
        build: zod_1.z.string(),
        context: zod_1.z.string().optional()
    })),
});
const validateSealService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ServiceConfigSchema.parseAsync(context);
    }
    catch (error) {
        // @ts-ignore ZodError
        yield (0, exit_with_msg_1.exitWithMsg)(error.errors);
    }
    return context;
});
exports.validateSealService = validateSealService;
