export interface ILogoutUseCase{
    execute(accessToken:string):Promise<void>
}