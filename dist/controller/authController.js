"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const authService_1 = require("../services/authService");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const authService = require('../services/authService');
const signup = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const existingUser = await (0, authService_1.getUserByUsername)(username);
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await (0, authService_1.createUser)(username, hashedPassword, email);
        if (!newUser) {
            return res.status(500).json({ message: 'Failed to create user' });
        }
        //const token = jwt.sign({ sub: newUser.id }, 'your-secret-key', { expiresIn: '15m' });
        const token = jwt.sign({ sub: newUser.id }, 'your-secret-key', { expiresIn: '15m' });
        res.json({ message: 'User created successfully', token: token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await (0, authService_1.authenticateUser)(username, password);
        const token = (0, authService_1.createToken)(user);
        // Set JWT token cookie here if needed
        res.json({ token });
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};
exports.login = login;
const logout = (req, res) => {
    // Clear JWT token cookie here if needed
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
