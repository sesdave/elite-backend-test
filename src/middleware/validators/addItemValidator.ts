// validators/addItemValidator.ts

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const addItemSchema = Joi.object({
  quantity: Joi.number().required(),
  expiry: Joi.number().required(),
});

const addQuantitySchema = Joi.object({
  quantity: Joi.number().required(),
});

export const validateAddItem = (req: Request, res: Response, next: NextFunction) => {
  const { error } = addItemSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateAddQuantity = (req: Request, res: Response, next: NextFunction) => {
  const { error } = addQuantitySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
