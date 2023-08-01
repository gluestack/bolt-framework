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
        define(["require", "exports", "./get-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateStoreRootData = exports.updateStore = void 0;
    const get_store_1 = __importDefault(require("./get-store"));
    const updateStore = (key, value, data) => __awaiter(void 0, void 0, void 0, function* () {
        const store = yield (0, get_store_1.default)();
        const storeData = store.get(key) || {};
        let found = false;
        if (!data) {
            store.set(key, value);
            store.save();
            return;
        }
        // check if service already exists, if yes, update it
        if (storeData[value]) {
            found = true;
            storeData[value] = data;
        }
        // if not, add it
        if (!found) {
            storeData[value] = data;
        }
        // update the store
        store.set(key, storeData);
        store.save();
    });
    exports.updateStore = updateStore;
    const updateStoreRootData = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
        const store = yield (0, get_store_1.default)();
        store.set(key, value);
        store.save();
    });
    exports.updateStoreRootData = updateStoreRootData;
});
