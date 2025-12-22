export interface IOtpService{
    hash(otp:string):Promise<string>
    compare(plain: string, hashed: string): Promise<boolean>
}