"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemQuantityHandler = exports.sellItemHandler = exports.addLotHandler = void 0;
const itemService_1 = require("../services/itemService");
const addLotHandler = async (req, res, next) => {
    try {
        const { item } = req.params;
        const { quantity, expiry } = req.body;
        await (0, itemService_1.addLot)(item, quantity, expiry);
        return res.status(200).json({});
    }
    catch (error) {
        console.error('Error while adding a lot:', error);
        next(error);
    }
};
exports.addLotHandler = addLotHandler;
const sellItemHandler = async (req, res, next) => {
    try {
        const { item } = req.params;
        const { quantity } = req.body;
        console.log(`Selling item ${quantity} - ${item}`);
        await (0, itemService_1.sellItem)(item, quantity);
        return res.status(200).json({});
    }
    catch (error) {
        console.error('Error while selling an item:', error);
        next(error);
    }
};
exports.sellItemHandler = sellItemHandler;
const getItemQuantityHandler = async (req, res, next) => {
    try {
        const { item } = req.params;
        const quantity = await (0, itemService_1.getItemQuantity)(item);
        return res.status(200).json({ quantity });
    }
    catch (error) {
        console.error('Error while fetching item quantity:', error);
        next(error);
    }
};
exports.getItemQuantityHandler = getItemQuantityHandler;
