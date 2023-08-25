import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  password: process.env.REDIS_PASSWORD || '',
});

export const getAsync = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    if (data !== null) {
      console.log(`Received Data Cache ${data}`)
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error while getting data from Redis:', error);
    return null;
  }
};

export const setAsync = async <T>(key: string, value: T, expiresInSeconds: number): Promise<void> => {
  try {
    console.log(`incoming Cache ${key} ${value}`)
    await redis.setex(key, expiresInSeconds, JSON.stringify(value));
  } catch (error) {
    console.error('Error while setting data in Redis:', error);
  }
};

export const clearAllCache = async (): Promise<void> => {
  try {
    await redis.flushdb();
  } catch (error) {
    console.error('Error while clearing all cache:', error);
  }
};


