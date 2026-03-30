export interface IRedisLockService {
    acquireLock(key: string, ttlSeconds: number): Promise<boolean>;
    releaseLock(key: string): Promise<void>;
}
