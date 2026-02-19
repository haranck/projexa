import { IProjectEntity } from "../../../../domain/entities/Project/IProjectEntity";

export interface GetAllProjectsResponseDTO {
    projects: IProjectEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
