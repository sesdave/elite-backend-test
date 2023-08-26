import { Op } from 'sequelize';
import { Lot } from '../models';
import { getAsync, setAsync } from '../utils/cache';
import { sequelize } from '../models';
import { throwCustomError } from '../utils/errorUtil'

export const addLot = async (item: string, quantity: number, expiry: number) => {
  console.log(`Add Lot ${quantity} - ${expiry}`)
  // Validate input data
  if (!quantity || !expiry) {
    throw new Error('Invalid input data');
  }
  const t0 = Date.now(); // Current time in milliseconds
  // Add the lot to the database
  const lot = await Lot.create({
    item,
    quantity,
    expiry: t0 + expiry,
  });


  // Update the cache
  await updateCache(item);
};

export const sellItem = async (item: string, quantity: number) => {

  // Check if the item exists and has enough non-expired quantity
  const availableQuantity = await getItemQuantity(item);
  const ravailableQuantity = availableQuantity.quantity
  
  console.log(`Avalable ${ravailableQuantity} - ${ravailableQuantity < quantity}`)

  if (ravailableQuantity < quantity) {
    console.log(`Insufficient quantity for ${item}`);
    return
  }
  const newQuantity = ravailableQuantity - quantity
  console.log(`Sold ${ravailableQuantity} - ${quantity} -${newQuantity}`)

  // Update the database with the sold quantity
  await Lot.update( //parseInt(stringValue, 10)
    { quantity:  newQuantity },
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
  try {
    const cachedData = await getAsync<{ quantity: number; validTill: number }>(item);

    if (cachedData) {
      console.log(`Cached item ${JSON.stringify(cachedData)}`)
      return {
        quantity: cachedData.quantity,
        validTill: cachedData.validTill,
      };
    } else {
      const quantity = await getDatabaseItemQuantity(item);
      let validTill: number | null = null;  // Initialize validTill as null

      if (quantity > 0) {
        validTill = Date.now() + quantity * 1000;
        await setAsync(item, { quantity, validTill }, Math.ceil((validTill - Date.now()) / 1000));
      }

      return {
        quantity,
        validTill: validTill,  // Use the calculated validTill value
      };
    }
  } catch (error) {
    console.error('Error fetching quantity:', error);
    return {
      quantity: await getDatabaseItemQuantity(item),
      validTill: null,
    };
  }
};





const updateCache = async (item: string) => {
  try {
    console.log("Update Caching")
    // Fetch the latest quantity from the database
    const quantity = await getDatabaseItemQuantity(item);

    // Update the cache with the latest quantity and validTill
    if (quantity > 0) {
      const validTill = Date.now() + (quantity * 1000);
      const cacheData = { quantity, validTill };
      console.log(`Caching ${JSON.stringify(cacheData)}`)
      
      // Set the cache data and its expiry
      await setAsync(item, cacheData, Math.ceil((validTill - Date.now()) / 1000));
    }
  } catch (error) {
    console.error('Error updating cache:', error);
  }
};

export default updateCache;


const getDatabaseItemQuantity = async (item: string): Promise<number> => {
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


