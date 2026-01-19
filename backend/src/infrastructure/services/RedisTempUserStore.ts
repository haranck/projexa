import { redisClient } from "../cache/redisClient";
import { ITempUserStore, ITempUserData } from "../../domain/interfaces/services/ITempUserStore";

export class RedisTempUserStore implements ITempUserStore {
    
  private _key(email: string) {
    return `temp-user:${email}`;
  }

  async save(email: string, data: ITempUserData, ttlSeconds: number): Promise<void> {
    await redisClient.set(
      this._key(email),
      JSON.stringify(data),
      "EX",
      ttlSeconds
    );
  }

  async get(email: string): Promise<ITempUserData | null> {
    const raw = await redisClient.get(this._key(email));
    return raw ? JSON.parse(raw) : null;
  }

  async delete(email: string): Promise<void> {
    await redisClient.del(this._key(email));
  }
}
