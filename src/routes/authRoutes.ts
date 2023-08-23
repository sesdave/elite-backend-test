// src/routes/authRoutes.ts
import { Router } from 'express';
import passport from 'passport';
import { login, logout } from '../controller/authController';

const router = Router();

router.post('/login', passport.authenticate('jwt',  {}), login);
router.post('/logout', logout);

export default router;
