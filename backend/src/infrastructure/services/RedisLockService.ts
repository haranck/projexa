import { redisClient } from "../cache/redisClient";
import { IRedisLockService } from "../../domain/interfaces/services/IRedisLockService";
import { injectable } from "tsyringe";

@injectable()
export class RedisLockService implements IRedisLockService {
    async acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
        const result = await redisClient.set(key, "locked", "EX", ttlSeconds, "NX");
        return result === "OK";
    }

    async releaseLock(key: string): Promise<void> {
        await redisClient.del(key);
    }
}
