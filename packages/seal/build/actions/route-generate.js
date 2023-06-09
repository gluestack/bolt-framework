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
const generate_routes_1 = __importDefault(require("../helpers/generate-routes"));
const up_1 = require("./up");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const _yamlContent = yield (0, up_1.getAndValidateSealYaml)();
    console.log(`> Creating Ingress ${_yamlContent.project_name}...`);
    yield (0, generate_routes_1.default)(_yamlContent);
    process.exit(0);
});
