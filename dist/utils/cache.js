"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllCache = exports.setAsync = exports.getAsync = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
    password: process.env.REDIS_PASSWORD || '',
});
const getAsync = async (key) => {
    try {
        const data = await redis.get(key);
        if (data !== null) {
            console.log(`Received Data Cache ${data}`);
            return JSON.parse(data);
        }
        return null;
    }
    catch (error) {
        console.error('Error while getting data from Redis:', error);
        return null;
    }
};
exports.getAsync = getAsync;
const setAsync = async (key, value, expiresInSeconds) => {
    try {
        console.log(`incoming Cache ${key} ${value}`);
        await redis.setex(key, expiresInSeconds, JSON.stringify(value));
    }
    catch (error) {
        console.error('Error while setting data in Redis:', error);
    }
};
exports.setAsync = setAsync;
const clearAllCache = async () => {
    try {
        await redis.flushdb();
    }
    catch (error) {
        console.error('Error while clearing all cache:', error);
    }
};
exports.clearAllCache = clearAllCache;
