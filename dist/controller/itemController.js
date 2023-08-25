"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemQuantityHandler = exports.sellItemHandler = exports.addLotHandler = void 0;
const itemService_1 = require("../services/itemService");
const sellWorker_1 = require("../workers/sellWorker");
const queueUrl = process.env.queueUrl || "https://sqs.us-west-2.amazonaws.com/334236250727/elite-dev";
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
        const sellRequestData = {
            item,
            quantity,
        };
        // Enqueue the sell request using the worker
        await (0, sellWorker_1.enqueueSellRequest)(sellRequestData, queueUrl);
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
