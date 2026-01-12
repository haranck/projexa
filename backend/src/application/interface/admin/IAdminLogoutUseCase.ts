export interface IAdminLogoutUseCase{
    execute(accessToken:string):Promise<void>
}