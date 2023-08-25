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
const errorHandler_1 = require("../src/middleware/errorHandler");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("./auth/passport")); // Import Passport
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP to 100 requests per windowMs
});
const app = (0, express_1.default)();
(0, cleanup_1.performCleanup)();
const PORT = process.env.PORT || 3000;
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY || 'your-secrete-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
// Apply the rate limiter middleware to all requests
app.use(limiter);
// Use routes
app.use('/auth', authRoutes_1.default);
app.use('', itemRoutes_1.default);
app.use(errorHandler_1.handleErrors);
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
