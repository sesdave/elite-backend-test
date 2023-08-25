"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTableData = exports.performCleanup = void 0;
// src/cleanup.ts
const models_1 = require("./models");
const sequelize_1 = require("sequelize"); // Import Op from sequelize
const node_cron_1 = __importDefault(require("node-cron"));
// Define a function to perform the cleanup
const performCleanup = async () => {
    try {
        const currentTime = new Date();
        // Delete expired lots from the database
        await models_1.Lot.destroy({
            where: {
                expiry: {
                    [sequelize_1.Op.lt]: currentTime, // Use Op.lt here
                },
            },
        });
        console.log('Database cleanup task executed successfully.');
    }
    catch (error) {
        console.error('An error occurred during database cleanup:', error);
    }
};
exports.performCleanup = performCleanup;
const clearTableData = async () => {
    try {
        const currentTime = new Date();
        // Delete expired lots from the database
        await models_1.Lot.truncate();
        console.log('Database cleanup task executed successfully.');
    }
    catch (error) {
        console.error('An error occurred during database cleanup:', error);
    }
};
exports.clearTableData = clearTableData;
// Schedule the cleanup task to run daily at midnight
node_cron_1.default.schedule('0 0 * * *', exports.performCleanup);
