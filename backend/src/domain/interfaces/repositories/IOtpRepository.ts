import { OtpEntity } from "../../entities/OtpEntity";

export interface IOtpRepository{
    create(otp:OtpEntity):Promise<void>;
    findValidOtp(userId:string,code:string):Promise<OtpEntity|null>
    markAsUsed(otpId:string):Promise<void>
}

