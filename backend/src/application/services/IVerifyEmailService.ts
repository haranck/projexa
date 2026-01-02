export interface IVerifyEmailService{
    execute(email:string,otpCode:string):Promise<void>
}