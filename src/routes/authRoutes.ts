// src/routes/authRoutes.ts
import { Router } from 'express';
import { login, logout } from '../controller/authController';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);

export default router;
