import { IOtpEntity } from "../../entities/IOtpEntity";

export interface IOtpRepository {
    createOtp(otp: IOtpEntity): Promise<void>;
    findValidOtp(email: string, code: string): Promise<IOtpEntity | null>;
    deleteByEmail(email: string): Promise<void>;
}
