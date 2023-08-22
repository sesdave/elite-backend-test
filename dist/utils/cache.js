"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expireAsync = exports.setAsync = exports.getAsync = void 0;
const redis = require('redis');
const { promisify } = require('util');
// Update these values with your Redis server details
const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
    password: process.env.REDIS_PASSWORD || '',
};
const client = redis.createClient(redisOptions);
exports.getAsync = promisify(client.get).bind(client);
exports.setAsync = promisify(client.set).bind(client);
exports.expireAsync = promisify(client.expire).bind(client);
