import Redis from 'ioredis';

class LockService {
  private static redis: Redis;

  constructor() {
    const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';

    // Parse the Redis URL
    const redisParts = new URL(redisURL);

    LockService.redis = new Redis({
      host: redisParts.hostname,
      port: Number(redisParts.port),
      password: redisParts.password,
    });
  }

async acquireLock(lockKey: string, lockTimeout: number): Promise<string | null> {
    try {
      const lockValue = Date.now() + lockTimeout + 1; // Set lock expiration
      const result = await LockService.redis.set(lockKey, lockValue, 'PX', lockTimeout, 'NX');

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
  }

async releaseLock(lockKey: string): Promise<boolean> {
    try {
      const result = await LockService.redis.del(lockKey);
      return result === 1;
    } catch (error) {
      console.error('Error while releasing lock:', error);
      return false;
    }
  }
}

export default LockService;
