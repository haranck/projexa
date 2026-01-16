import { ITokenBlacklistRepository } from "../../../../domain/interfaces/repositories/ITokenBlacklistRepository";
import { redisClient } from "../../../cache/redisClient";

export class RedisTokenBlacklistRepository implements ITokenBlacklistRepository {
  async blacklist(token: string, expiresAfterSeconds: number): Promise<void> {
    await redisClient.set(
      `blacklist:${token}`,
      "true",
      "EX",
      expiresAfterSeconds
    );
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await redisClient.get(`blacklist:${token}`)
    return result === 'true'
  }
} 
