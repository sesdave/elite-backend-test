import { Sequelize } from 'sequelize';
import LotModel from './Lot';
//import UserModel from './User'; // Import the User model
import { UserModelDefinition } from './User';
import fs from 'fs'
const path = require('path');

//import UserModel, { UserModel } from './User';

// Initialize Sequelize with your database configuration
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'friend', 
  database: process.env.POSTGRES_NAME || 'postgres', 
  /*ssl: true,
  dialectOptions: {
    ssl: {
      require: true, // Require SSL
      ca: fs.readFileSync(path.resolve(__dirname, '../../certs/ca.pem')), // Full path to ca.pem certificate
    },
  },*/
});

// Define models
const Lot = LotModel(sequelize);
const User = UserModelDefinition(sequelize); // Initialize the User model

export { sequelize, Lot, User }; // Export User along with other models
