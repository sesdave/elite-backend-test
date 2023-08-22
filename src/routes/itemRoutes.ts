// src/routes/itemRoutes.ts
import { Router } from 'express';
import { validateAddItem } from '../validators/addItemValidator';
import { addLotHandler, sellItemHandler, getItemQuantityHandler } from '../controller/itemController';
import authenticate from '../auth/authenticationMiddleware';

const router = Router();

router.post('/:item/add',authenticate, validateAddItem, addLotHandler);
router.post('/:item/sell', sellItemHandler);
router.get('/:item/quantity', getItemQuantityHandler);

export default router;
