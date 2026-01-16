export interface IVerifyEmailUseCase{
    execute(email:string,otpCode:string):Promise<void>
}