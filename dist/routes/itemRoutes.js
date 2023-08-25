"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/itemRoutes.ts
const express_1 = require("express");
const addItemValidator_1 = require("../middleware/validators/addItemValidator");
const itemController_1 = require("../controller/itemController");
const router = (0, express_1.Router)();
router.post('/:item/add', addItemValidator_1.validateAddItem, itemController_1.addLotHandler);
router.post('/:item/sell', addItemValidator_1.validateAddQuantity, itemController_1.sellItemHandler);
router.get('/:item/quantity', itemController_1.getItemQuantityHandler);
exports.default = router;
