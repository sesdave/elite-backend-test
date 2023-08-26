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
  host: process.env.POSTGRES_HOST || 'pg-2480f26e-developerdavids-8cc4.aivencloud.com',//'localhost',//
  port: Number(process.env.POSTGRES_PORT) || 24745,//24745,
  username: process.env.POSTGRES_USER || 'avnadmin',//'postgres'
  password: process.env.POSTGRES_PASSWORD || 'AVNS_VEJqirdL2fMNLEmCVqt',//'friend', //
  database: process.env.POSTGRES_NAME || 'defaultdb',//'postgres', //
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true, // Require SSL
      ca: fs.readFileSync('../../certs/ca.pem').toString(),
    },
  },
});

// Define models
const Lot = LotModel(sequelize);
//const UserModel = UserModelDefinition(sequelize);
const User = UserModelDefinition(sequelize); // Initialize the User model

export { sequelize, Lot, User }; // Export User along with other models
