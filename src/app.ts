require('dotenv').config({ path: './process.env' })
import express from 'express';
import session from 'express-session';
import { Sequelize } from 'sequelize-typescript';
import { sequelize } from './models';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import { performCleanup } from  './cleanup'; 
import { handleErrors } from '../src/middleware/errorHandler'


import rateLimit from 'express-rate-limit';

import cookieParser from 'cookie-parser';

import passport from './auth/passport';// Import Passport


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});




const app = express();


performCleanup();


const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET_KEY || 'your-secrete-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true for HTTPS environments
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  }));

app.use(passport.initialize());
app.use(passport.session());



app.use(express.json());
// Apply the rate limiter middleware to all requests
app.use(limiter);
// Use routes
app.use('/auth', authRoutes);
app.use('', itemRoutes);

app.use(handleErrors);


// Schedule a cleanup job every day at midnight to remove expired lots
const port = process.env.PORT || 3000

sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });

