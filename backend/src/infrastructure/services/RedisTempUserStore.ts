import { redisClient } from "../cache/redisClient";
import { ITempUserStore, TempUserData } from "../../domain/interfaces/services/ITempUserStore";

export class RedisTempUserStore implements ITempUserStore {
    
  private key(email: string) {
    return `temp-user:${email}`;
  }

  async save(email: string, data: TempUserData, ttlSeconds: number): Promise<void> {
    await redisClient.set(
      this.key(email),
      JSON.stringify(data),
      "EX",
      ttlSeconds
    );
  }

  async get(email: string): Promise<TempUserData | null> {
    const raw = await redisClient.get(this.key(email));
    return raw ? JSON.parse(raw) : null;
  }

  async delete(email: string): Promise<void> {
    await redisClient.del(this.key(email));
  }
}
