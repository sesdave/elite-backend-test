import Redis from 'ioredis';

const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';

// Parse the Redis URL
const redisParts = new URL(redisURL);

const redis = new Redis({
  host: redisParts.hostname,
  port: Number(redisParts.port),
  password: redisParts.password,
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


export const acquireLock = async (lockKey: string, lockTimeout: number): Promise<string | null> => {
  try {
    const lockValue = Date.now() + lockTimeout + 1; // Set lock expiration
    const result = await redis.set(lockKey, lockValue, 'PX', lockTimeout, 'NX');
    
    if (result === 'OK') {
      // Lock acquired successfully
      return lockKey;
    }

    // Lock is already held by someone else
    return null;
  } catch (error) {
    console.error('Error while acquiring lock:', error);
    return null;
  }
};

export const releaseLock = async (lockKey: string): Promise<boolean> => {
  try {
    const result = await redis.del(lockKey);
    return result === 1;
  } catch (error) {
    console.error('Error while releasing lock:', error);
    return false;
  }
};

export const deleteAsync = async (key: string): Promise<boolean> => {
  try {
    // Use the `del` method to delete the specified key
    const result = await redis.del(key);
    return result === 1;
  } catch (error) {
    console.error('Error deleting key from cache:', error);
    return false; // Return false to indicate an error
  }
};


