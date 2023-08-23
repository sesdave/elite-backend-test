"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
router.post('/login', passport_1.default.authenticate('jwt', {}), authController_1.login);
router.post('/logout', authController_1.logout);
exports.default = router;
