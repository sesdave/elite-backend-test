"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemQuantity = exports.sellItem = exports.addLot = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const cache_1 = require("../utils/cache");
const models_2 = require("../models");
const addLot = async (item, quantity, expiry) => {
    // Validate input data
    if (!quantity || !expiry) {
        throw new Error('Invalid input data');
    }
    // Add the lot to the database
    await models_1.Lot.create({
        item,
        quantity,
        expiry: new Date(expiry),
    });
    // Update the cache
    await updateCache(item);
};
exports.addLot = addLot;
const sellItem = async (item, quantity) => {
    // Validate input data
    if (!quantity) {
        throw new Error('Invalid input data');
    }
    // Check if the item exists and has enough non-expired quantity
    const availableQuantity = await (0, exports.getItemQuantity)(item);
    if (availableQuantity < quantity) {
        throw new Error('Insufficient quantity available');
    }
    // Update the database with the sold quantity
    await models_1.Lot.update({ quantity: availableQuantity - quantity }, {
        where: {
            item,
            expiry: { [sequelize_1.Op.gt]: new Date() },
        },
    });
    // Update the cache
    await updateCache(item);
};
exports.sellItem = sellItem;
const getItemQuantity = async (item) => {
    const cachedData = await (0, cache_1.getAsync)(item);
    if (cachedData) {
        const { quantity } = JSON.parse(cachedData);
        return quantity;
    }
    // If cache data not available, fetch from the database
    const quantity = await getDatabaseItemQuantity(item);
    return quantity;
};
exports.getItemQuantity = getItemQuantity;
const updateCache = async (item) => {
    // Fetch the latest quantity from the database
    const quantity = await getDatabaseItemQuantity(item);
    // Update the cache with the latest quantity and validTill
    if (quantity > 0) {
        const validTill = Date.now() + (quantity * 1000);
        await (0, cache_1.setAsync)(item, JSON.stringify({ quantity, validTill }));
        await (0, cache_1.expireAsync)(item, Math.ceil((validTill - Date.now()) / 1000));
    }
};
const getDatabaseItemQuantity = async (item) => {
    try {
        // Fetch the non-expired quantity of the item from the database
        const currentTime = new Date();
        const lot = await models_1.Lot.findOne({
            where: {
                item,
                expiry: { [sequelize_1.Op.gt]: currentTime },
            },
            attributes: [[models_2.sequelize.fn('SUM', models_2.sequelize.col('quantity')), 'totalQuantity']],
        });
        // Get the totalQuantity from the result or default to 0
        const totalQuantity = (lot === null || lot === void 0 ? void 0 : lot.get('totalQuantity')) || 0;
        return totalQuantity;
    }
    catch (error) {
        console.error('Error while fetching item quantity from the database:', error);
        throw new Error('Database Error');
    }
};
/*const getDatabaseItemQuantity = async (item: string) => {
  try {
    // Fetch the non-expired quantity of the item from the database
    const currentTime = new Date();
    const lot = await Lot.findOne({
      where: {
        item,
        expiry: { [Op.gt]: currentTime },
      },
      attributes: [[sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity']],
    });

    const totalQuantity = lot?.get('totalQuantity') || 0;
    return totalQuantity;
  } catch (error) {
    console.error('Error while fetching item quantity from the database:', error);
    throw new Error('Database Error');
  }
};
*/
