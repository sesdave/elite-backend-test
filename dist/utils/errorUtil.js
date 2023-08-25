"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwCustomError = void 0;
const customError_1 = require("./customError");
function throwCustomError(message, statusCode) {
    throw new customError_1.CustomError(message, statusCode);
}
exports.throwCustomError = throwCustomError;
