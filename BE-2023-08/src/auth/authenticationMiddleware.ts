// auth/authenticationMiddleware.ts

import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err || !user) {
      // Handle authentication failure
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

export default authenticationMiddleware;
