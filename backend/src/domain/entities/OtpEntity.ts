export interface OtpEntity{
    id?:string;
    userId:string;
    code:string;
    expiresAt:Date;
    isUsed:boolean;
    createdAt:Date;
}