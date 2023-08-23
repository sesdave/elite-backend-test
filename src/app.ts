require('dotenv').config({ path: './process.env' })
import express from 'express';
import session from 'express-session';
import { Sequelize } from 'sequelize-typescript';
import cron from 'node-cron';
import joi from 'joi';
import redis from 'redis';
import { sequelize } from './models';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import { performCleanup } from  './cleanup'; 
//import sequelize from './db';


import rateLimit from 'express-rate-limit';

import cookieParser from 'cookie-parser';

import passport from './auth/passport';// Import Passport
//import initializePassport from './config/passport'; // Import Passport configuration
//import dotenv from 'dotenv';
//dotenv.config();




const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});




const app = express();

// Initialize Passport
//initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

performCleanup();


const PORT = process.env.PORT || 3000;

/*const schema = joi.object({
  quantity: joi.number().integer().min(1).required(),
  expiry: joi.number().integer().positive().required(),
});*/

app.use(cookieParser());

app.use(session({
    secret: 'your-secret-key',
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
app.use('/:item', itemRoutes);

// Create a Redis client

/*app.post('/:item/add', async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { item } = req.params;
  const { quantity, expiry } = req.body;

  await Lot.create({ quantity, expiry });
  res.json({});
});

app.post('/:item/sell', async (req, res) => {
  const { item } = req.params;
  const { quantity } = req.body;

  const lots = await Lot.findAll({
    where: {
      expiry: {
        [Sequelize.Op.gt]: Date.now(),
      },
    },
    order: [['expiry', 'ASC']],
  });

  let remainingQuantity = quantity;

  for (const lot of lots) {
    if (remainingQuantity > 0) {
      const quantityToSell = Math.min(remainingQuantity, lot.quantity);
      await lot.update({ quantity: lot.quantity - quantityToSell });
      remainingQuantity -= quantityToSell;
    } else {
      break;
    }
  }

  res.json({});
});

app.get('/:item/quantity', async (req, res) => {
  const { item } = req.params;

  const lots = await Lot.findAll({
    where: {
      expiry: {
        [Sequelize.Op.gt]: Date.now(),
      },
    },
  });

  let totalQuantity = 0;
  let validTill = null;

  for (const lot of lots) {
    totalQuantity += lot.quantity;
    if (!validTill || lot.expiry < validTill) {
      validTill = lot.expiry;
    }
  }

  res.json({
    quantity: totalQuantity,
    validTill,
  });
});
*/

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

