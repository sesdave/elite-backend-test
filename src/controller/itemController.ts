import { NextFunction, Request, Response } from 'express';
import { addLot, sellItem, getItemQuantity } from '../services/itemService';

export const addLotHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item } = req.params;
    const { quantity, expiry } = req.body;
    await addLot(item, quantity, expiry);
    return res.status(200).json({});
  } catch (error) {
    console.error('Error while adding a lot:', error);
    next(error)
  }
};

export const sellItemHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item } = req.params;
    const { quantity } = req.body;
    const sold = await sellItem(item, quantity);
    return res.status(200).json({sold});
  } catch (error) {
    console.error('Error while selling an item:', error);
    next(error)
  }
};

export const getItemQuantityHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item } = req.params;
    const quantity = await getItemQuantity(item);
    return res.status(200).json({ quantity });
  } catch (error) {
    console.error('Error while fetching item quantity:', error);
    next(error)
  }
};
