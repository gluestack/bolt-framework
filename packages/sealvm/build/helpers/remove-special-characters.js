"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSpecialCharacters = void 0;
const removeSpecialCharacters = (str) => {
    const regex = /[^a-zA-Z0-9 ]/g;
    str = str.replace(regex, "");
    return str;
};
exports.removeSpecialCharacters = removeSpecialCharacters;
