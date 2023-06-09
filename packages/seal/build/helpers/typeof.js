"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOf = void 0;
/**
 * typeOf returns the type of the value passed in.
 *
 * @param value any
 * @returns string
 */
const typeOf = (value) => {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};
exports.typeOf = typeOf;
