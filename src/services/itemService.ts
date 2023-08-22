import { Op } from 'sequelize';
import { Lot } from '../models';
import { getAsync, setAsync, expireAsync } from '../utils/cache';
import { sequelize } from '../models';

export const addLot = async (item: string, quantity: number, expiry: number) => {
  // Validate input data
  if (!quantity || !expiry) {
    throw new Error('Invalid input data');
  }

  // Add the lot to the database
  await Lot.create({
    item,
    quantity,
    expiry: new Date(expiry),
  });

  // Update the cache
  await updateCache(item);
};

export const sellItem = async (item: string, quantity: number) => {
  // Validate input data
  if (!quantity) {
    throw new Error('Invalid input data');
  }

  // Check if the item exists and has enough non-expired quantity
  const availableQuantity = await getItemQuantity(item);

  if (availableQuantity < quantity) {
    throw new Error('Insufficient quantity available');
  }

  // Update the database with the sold quantity
  await Lot.update(
    { quantity: availableQuantity - quantity },
    {
      where: {
        item,
        expiry: { [Op.gt]: new Date() },
      },
    }
  );

  // Update the cache
  await updateCache(item);
};

export const getItemQuantity = async (item: string) => {
  const cachedData = await getAsync(item);

  if (cachedData) {
    const { quantity } = JSON.parse(cachedData);
    return quantity;
  }

  // If cache data not available, fetch from the database
  const quantity = await getDatabaseItemQuantity(item);

  return quantity;
};

const updateCache = async (item: string) => {
  // Fetch the latest quantity from the database
  const quantity = await getDatabaseItemQuantity(item);

  // Update the cache with the latest quantity and validTill
  if (quantity > 0) {
    const validTill = Date.now() + (quantity * 1000);
    await setAsync(item, JSON.stringify({ quantity, validTill }));
    await expireAsync(item, Math.ceil((validTill - Date.now()) / 1000));
  }
};

const getDatabaseItemQuantity = async (item: string): Promise<number> => {
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
  
      // Get the totalQuantity from the result or default to 0
      const totalQuantity = lot?.get('totalQuantity') as number || 0;
      return totalQuantity;
    } catch (error) {
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


