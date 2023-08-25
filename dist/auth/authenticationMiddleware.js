"use strict";
// auth/authenticationMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const authenticationMiddleware = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            // Handle authentication failure
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        return next();
    })(req, res, next);
};
exports.default = authenticationMiddleware;
