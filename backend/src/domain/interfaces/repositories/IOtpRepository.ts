import { IOtpEntity } from "../../entities/IOtpEntity";

export interface IOtpRepository {
    createOtp(otp: IOtpEntity): Promise<void>;
    findValidOtp(email: string, code: string): Promise<IOtpEntity | null>;
    markAsUsed(otpId: string): Promise<void>;
    invalidateAll(email: string): Promise<void>
}
