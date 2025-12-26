export interface ILogoutService{
    execute(accessToken:string):Promise<void>
}