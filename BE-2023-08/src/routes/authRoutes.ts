// src/routes/authRoutes.ts
import { Router } from 'express';
import passport from 'passport';
import { login, logout, signup } from '../controller/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
