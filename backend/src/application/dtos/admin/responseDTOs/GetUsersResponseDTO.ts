import { IUserEntity } from "../../../../domain/entities/IUserEntity";

export interface GetUsersResponseDTO {
    data: IUserEntity[];
    meta: {
        totalDocs: number;
        totalPages: number;
        page: number;
        limit: number;
    };
}