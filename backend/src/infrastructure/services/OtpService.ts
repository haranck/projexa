import { IOtpService } from "../../domain/interfaces/services/IOtpService";
import bcrypt from 'bcrypt'

export class OtpService implements IOtpService{
    async hash(otp:string):Promise<string> {
        return bcrypt.hash(otp,10)
    }
    async compare(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed)
    }
}
