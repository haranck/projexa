import { IUserEntity } from "../../domain/entities/IUserEntity";

export interface IGoogleLoginResult {
    accessToken: string;
    refreshToken: string;
    user: IUserEntity;
}

export interface IGoogleLoginService {
    execute(idToken: string): Promise<IGoogleLoginResult>;
}