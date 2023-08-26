"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
const customError_1 = require("../utils/customError");
const handleErrors = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    // Customize the error response based on the error status
    const status = err instanceof customError_1.CustomError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        error: message
    });
};
exports.handleErrors = handleErrors;
