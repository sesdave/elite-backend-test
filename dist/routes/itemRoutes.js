"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/itemRoutes.ts
const express_1 = require("express");
const addItemValidator_1 = require("../validators/addItemValidator");
const itemController_1 = require("../controller/itemController");
const authenticationMiddleware_1 = __importDefault(require("../auth/authenticationMiddleware"));
const router = (0, express_1.Router)();
router.post('/:item/add', authenticationMiddleware_1.default, addItemValidator_1.validateAddItem, itemController_1.addLotHandler);
router.post('/:item/sell', itemController_1.sellItemHandler);
router.get('/:item/quantity', itemController_1.getItemQuantityHandler);
exports.default = router;
