// MockLockService.ts
class MockLockService {
    private locks: Record<string, boolean> = {};
  
    async acquireLock(lockKey: string, lockTimeout: number): Promise<boolean> {
      if (!this.locks[lockKey]) {
        this.locks[lockKey] = true;
        return true;
      }
      return false;
    }
  
    async releaseLock(lockKey: string): Promise<void> {
      this.locks[lockKey] = false;
    }
  }
  
  export default MockLockService;
  