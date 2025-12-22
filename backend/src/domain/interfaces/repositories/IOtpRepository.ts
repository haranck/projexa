import { OtpEntity } from "../../entities/IOtpEntity";

export interface IOtpRepository{
    create(otp:OtpEntity):Promise<void>;
    findValidOtp(userId:string):Promise<OtpEntity|null>
    markAsUsed(otpId:string):Promise<void>
}

