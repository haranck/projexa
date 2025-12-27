export interface TempUserData{
    firstName:string,
    lastName:string,
    email:string,
    phone?:string,
    password:string,
    avatarUrl?:string
}

export interface ITempUserStore{
    save(email:string,data:TempUserData,ttlSeconds:number):Promise<void>
    get(email:string):Promise<TempUserData|null>
    delete(email:string):Promise<void>
}

