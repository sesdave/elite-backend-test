"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: './process.env' });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const models_1 = require("./models");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
const cleanup_1 = require("./cleanup");
//import sequelize from './db';
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("./auth/passport")); // Import Passport
//import initializePassport from './config/passport'; // Import Passport configuration
//import dotenv from 'dotenv';
//dotenv.config();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP to 100 requests per windowMs
});
const app = (0, express_1.default)();
// Initialize Passport
//initializePassport(passport);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, cleanup_1.performCleanup)();
const PORT = process.env.PORT || 3000;
/*const schema = joi.object({
  quantity: joi.number().integer().min(1).required(),
  expiry: joi.number().integer().positive().required(),
});*/
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
}));
app.use(express_1.default.json());
// Apply the rate limiter middleware to all requests
app.use(limiter);
// Use routes
app.use('/auth', authRoutes_1.default);
app.use('/:item', itemRoutes_1.default);
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
const port = process.env.PORT || 3000;
models_1.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch(error => {
    console.error('Database connection error:', error);
});
