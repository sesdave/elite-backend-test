"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemQuantity = exports.sellItem = exports.addLot = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const cache_1 = require("../utils/cache");
const models_2 = require("../models");
const errorUtil_1 = require("../utils/errorUtil");
const addLot = async (item, quantity, expiry) => {
    console.log(`Add Lot ${quantity} - ${expiry}`);
    // Validate input data
    if (!quantity || !expiry) {
        throw new Error('Invalid input data');
    }
    const t0 = Date.now(); // Current time in milliseconds
    // Add the lot to the database
    const lot = await models_1.Lot.create({
        item,
        quantity,
        expiry: t0 + expiry,
    });
    // Update the cache
    await updateCache(item);
};
exports.addLot = addLot;
const sellItem = async (item, quantity) => {
    // Validate input data
    if (!quantity) {
        throw (0, errorUtil_1.throwCustomError)('Invalid input data', 400);
    }
    // Check if the item exists and has enough non-expired quantity
    const availableQuantity = await (0, exports.getItemQuantity)(item);
    const ravailableQuantity = availableQuantity.quantity;
    const newQuantity = ravailableQuantity - quantity;
    if (ravailableQuantity < quantity) {
        throw (0, errorUtil_1.throwCustomError)('Insufficient quantity available', 400);
    }
    console.log(`Sold ${ravailableQuantity} - ${quantity} -${newQuantity}`);
    // Update the database with the sold quantity
    await models_1.Lot.update(//parseInt(stringValue, 10)
    { quantity: newQuantity }, {
        where: {
            item,
            expiry: { [sequelize_1.Op.gt]: new Date() },
        },
    });
    // Update the cache
    await updateCache(item);
};
exports.sellItem = sellItem;
/*export const getItemQuantity = async (item: string) => {
  const cachedData = await getAsync(item);

  if (cachedData) {
    const { quantity } = JSON.parse(cachedData);
    return quantity;
  }

  // If cache data not available, fetch from the database
  const quantity = await getDatabaseItemQuantity(item);

  return quantity;
};*/
/*export const getItemQuantity = async (item: string) => {
  let quantity: number;

  try {
    const cachedData = await getAsync(item);

    if (cachedData) {
      const { quantity: cachedQuantity } = JSON.parse(cachedData);
      quantity = cachedQuantity;
    } else {
      // Fetch from the database if cache data is not available
      quantity = await getDatabaseItemQuantity(item);
    }
  } catch (error) {
    console.error('Error fetching from Redis cache:', error);
    // Fetch from the database in case of Redis error
    quantity = await getDatabaseItemQuantity(item);
  }

  return quantity;
};*/
/*export const getItemQuantity = async (item: string) => {
  let quantity: number;

  try {
    const cachedData = await getAsync(item) as string;

    if (cachedData) {
      const cacheData = JSON.parse(cachedData);
      quantity = cacheData.quantity;
    } else {
      // Fetch from the database if cache data is not available
      quantity = await getDatabaseItemQuantity(item);

      // Update the cache with the fetched quantity
      if (quantity > 0) {
        await setAsync(item, { quantity }, Date.now());
      }
    }
  } catch (error) {
    console.error('Error fetching quantity:', error);
    quantity = await getDatabaseItemQuantity(item);
  }

  return quantity;
};
*/
/*export const getItemQuantity = async (item: string) => {
  try {
    const cachedData = await getAsync(item) as string;

    if (cachedData) {
      const cacheData = JSON.parse(cachedData);
      return cacheData.quantity;
    } else {
      const quantity = await getDatabaseItemQuantity(item);

      if (quantity > 0) {
        await setAsync(item, JSON.stringify({ quantity }), Math.ceil((Date.now() + quantity * 1000) / 1000));
      }

      return quantity;
    }
  } catch (error) {
    console.error('Error fetching quantity:', error);
    return await getDatabaseItemQuantity(item);
  }
};*/
/*export const getItemQuantity = async (item: string) => {
  try {
    const cachedData = await getAsync<{ quantity: number }>(item);

    if (cachedData) {
      return cachedData.quantity;
    } else {
      const quantity = await getDatabaseItemQuantity(item);

      if (quantity > 0) {
        const validTill = Date.now() + quantity * 1000;
        await setAsync(item, { quantity, validTill }, Math.ceil((validTill - Date.now()) / 1000));

       // await setAsync(item, { quantity }, Math.ceil((validTill - Date.now()) / 1000));
      }

      return quantity;
    }
  } catch (error) {
    console.error('Error fetching quantity:', error);
    return await getDatabaseItemQuantity(item);
  }
};*/
const getItemQuantity = async (item) => {
    try {
        const cachedData = await (0, cache_1.getAsync)(item);
        if (cachedData) {
            console.log(`Cached item ${JSON.stringify(cachedData)}`);
            return {
                quantity: cachedData.quantity,
                validTill: cachedData.validTill,
            };
        }
        else {
            const quantity = await getDatabaseItemQuantity(item);
            let validTill = null; // Initialize validTill as null
            if (quantity > 0) {
                validTill = Date.now() + quantity * 1000;
                await (0, cache_1.setAsync)(item, { quantity, validTill }, Math.ceil((validTill - Date.now()) / 1000));
            }
            return {
                quantity,
                validTill: validTill, // Use the calculated validTill value
            };
        }
    }
    catch (error) {
        console.error('Error fetching quantity:', error);
        return {
            quantity: await getDatabaseItemQuantity(item),
            validTill: null,
        };
    }
};
exports.getItemQuantity = getItemQuantity;
const updateCache = async (item) => {
    try {
        console.log("Update Caching");
        // Fetch the latest quantity from the database
        const quantity = await getDatabaseItemQuantity(item);
        // Update the cache with the latest quantity and validTill
        if (quantity > 0) {
            const validTill = Date.now() + (quantity * 1000);
            const cacheData = { quantity, validTill };
            console.log(`Caching ${JSON.stringify(cacheData)}`);
            // Set the cache data and its expiry
            await (0, cache_1.setAsync)(item, cacheData, Math.ceil((validTill - Date.now()) / 1000));
        }
    }
    catch (error) {
        console.error('Error updating cache:', error);
    }
};
exports.default = updateCache;
/*const updateCache = async (item: string) => {
  // Fetch the latest quantity from the database
  const quantity = await getDatabaseItemQuantity(item);

  // Update the cache with the latest quantity and validTill
  if (quantity > 0) {
    const validTill = Date.now() + (quantity * 1000);
    await setAsync(item, JSON.stringify({ quantity, validTill }));
    await expireAsync(item, Math.ceil((validTill - Date.now()) / 1000));
  }
};*/
/*const getDatabaseItemQuantity = async (item: string): Promise<number> => {
  try {
    const currentTime = new Date();
    
    const lot = await Lot.findOne({
      where: {
        item,
        expiry: { [Op.gt]: currentTime },
      },
      attributes: [
        [sequelize.literal('SUM(quantity)'), 'totalQuantity']
      ],
    });
    console.log(`Total Lot: ${JSON.stringify(lot)}`);
    //const totalQuantity = lot?.get('totalQuantity') as number || 0;
    const totalQuantity = lot ? Number(lot.get('totalQuantity')) || 0 : 0;
    
    console.log(`Total Quantity: ${totalQuantity}`);
    return totalQuantity;
  } catch (error) {
    console.error('Error while fetching item quantity from the database:', error);
    throw error; // Simply rethrow the caught error
  }
};
*/
const getDatabaseItemQuantity = async (item) => {
    try {
        const currentTime = new Date();
        const lot = await models_1.Lot.findOne({
            where: {
                item,
                expiry: { [sequelize_1.Op.gt]: currentTime },
            },
            attributes: [
                [models_2.sequelize.literal('SUM(quantity)'), 'totalQuantity']
            ],
        });
        console.log(`Total Lot: ${JSON.stringify(lot)}`);
        const totalQuantity = lot ? safeParseInt(lot.get('totalQuantity')) || 0 : 0;
        console.log(`Total Quantity: ${totalQuantity}`);
        return totalQuantity;
    }
    catch (error) {
        console.error('Error while fetching item quantity from the database:', error);
        throw error; // Simply rethrow the caught error
    }
};
// A utility function to parse integers safely
const safeParseInt = (value) => {
    if (typeof value === 'bigint') {
        // If it's a BigInt, try to convert it to a string first
        return Number(value.toString());
    }
    // Otherwise, parse it as a regular number
    return parseInt(value, 10);
};
