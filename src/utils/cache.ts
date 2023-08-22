const redis = require('redis');
const { promisify } = require('util');

// Update these values with your Redis server details
const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  password: process.env.REDIS_PASSWORD || '',
};

const client = redis.createClient(redisOptions);

export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.set).bind(client);
export const expireAsync = promisify(client.expire).bind(client);
