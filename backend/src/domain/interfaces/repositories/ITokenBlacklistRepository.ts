export interface ITokenBlacklistRepository {
    blacklist(token:string,expiresAfterSeconds:number):Promise<void>;
    isBlacklisted(token:string):Promise<boolean>
}