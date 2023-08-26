"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.authenticateUser = exports.createUser = exports.getUserByUsername = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models"); // Import your User model
//import { UserModel } from '../models';
//const { User } = require('../models');
//import { User } from '../models';
const getUserByUsername = async (username) => {
    return await models_1.User.findOne({ where: { username } });
};
exports.getUserByUsername = getUserByUsername;
const createUser = async (username, password, email) => {
    const newUser = await models_1.User.create({
        username: username,
        password: password,
        email: email,
    });
    return newUser;
};
exports.createUser = createUser;
const authenticateUser = async (username, password) => {
    console.log('Trying to authenticate user:', username);
    const user = await models_1.User.findOne({ where: { username } });
    if (!user || !bcrypt_1.default.compareSync(password, user.password)) {
        console.log('Authentication failed for:', username);
        throw new Error('Invalid credentials');
    }
    console.log('Authentication successful for:', username);
    return user;
};
exports.authenticateUser = authenticateUser;
const createToken = (user) => {
    // Create JWT token
    const token = jsonwebtoken_1.default.sign({ sub: user.id }, 'your-secret-key', { expiresIn: '15m' });
    return token;
};
exports.createToken = createToken;
