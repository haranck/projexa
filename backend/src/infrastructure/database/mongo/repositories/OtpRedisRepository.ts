import { IOtpRepository } from "../../../../domain/interfaces/repositories/IOtpRepository";
import { IOtpEntity } from "../../../../domain/entities/IOtpEntity";
import { redisClient } from "../../../cache/redisClient";
import { injectable } from "tsyringe";

@injectable()
export class OtpRedisRepository implements IOtpRepository {
    private readonly prefix = "otp";

    async createOtp(otp: IOtpEntity): Promise<void> {
        const key = `${this.prefix}:${otp.userId}`;
        const ttl = Math.floor((new Date(otp.expiresAt).getTime() - Date.now()) / 1000);

        if (ttl <= 0) return;

        const otpData = {
            ...otp,
            _id: otp.userId
        };

        await redisClient.set(
            key,
            JSON.stringify(otpData),
            "EX",
            ttl
        );
    }

    async findValidOtp(email: string, code: string): Promise<IOtpEntity | null> {
        const data = await redisClient.get(`${this.prefix}:${email}`);
        if (!data) return null;

        const otp = JSON.parse(data) as IOtpEntity;

        const expiresAt = new Date(otp.expiresAt);

        if (otp.code === code && !otp.isUsed && expiresAt > new Date()) {
            return {
                ...otp,
                expiresAt,
                createdAt: new Date(otp.createdAt)
            };
        }

        return null;
    }

    async deleteByEmail(email: string): Promise<void> {
        await redisClient.del(`${this.prefix}:${email}`);
    }
}
