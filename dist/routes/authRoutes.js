"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
router.post('/login', authController_1.login);
router.post('/logout', authController_1.logout);
exports.default = router;
