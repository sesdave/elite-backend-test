"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Lot = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const Lot_1 = __importDefault(require("./Lot"));
//import UserModel from './User'; // Import the User model
const User_1 = require("./User");
const fs_1 = __importDefault(require("fs"));
const path = require('path');
//import UserModel, { UserModel } from './User';
// Initialize Sequelize with your database configuration
const sequelize = new sequelize_1.Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST || 'pg-2480f26e-developerdavids-8cc4.aivencloud.com',
    port: Number(process.env.POSTGRES_PORT) || 24745,
    username: process.env.POSTGRES_USER || 'avnadmin',
    password: process.env.POSTGRES_PASSWORD || 'AVNS_VEJqirdL2fMNLEmCVqt',
    database: process.env.POSTGRES_NAME || 'defaultdb',
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            ca: fs_1.default.readFileSync(path.resolve(__dirname, '../../certs/ca.pem')), // Full path to ca.pem certificate
            //ca: fs.readFileSync('../certs/ca.pem').toString(),
        },
    },
});
exports.sequelize = sequelize;
// Define models
const Lot = (0, Lot_1.default)(sequelize);
exports.Lot = Lot;
//const UserModel = UserModelDefinition(sequelize);
const User = (0, User_1.UserModelDefinition)(sequelize); // Initialize the User model
exports.User = User;
