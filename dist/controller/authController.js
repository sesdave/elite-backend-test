"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const authService_1 = require("../services/authService");
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await (0, authService_1.authenticateUser)(username, password);
        const token = (0, authService_1.createToken)(user);
        // Set JWT token cookie here if needed
        res.json({ token });
    }
    catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};
exports.login = login;
const logout = (req, res) => {
    // Clear JWT token cookie here if needed
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
