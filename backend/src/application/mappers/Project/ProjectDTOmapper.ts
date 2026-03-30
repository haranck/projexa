import { IProjectEntity } from "../../../domain/entities/Project/IProjectEntity";
import { IProjectMemberEntity } from "../../../domain/entities/Project/IProjectMemberEntity";
import { GetAllProjectsResponseDTO } from "../../dtos/project/responseDTOs/GetAllProjectsResponseDTO";

export class ProjectDTOmapper {
    static toProjectResponseDTO(project: IProjectEntity): IProjectEntity {
        return project;
    }

    static toProjectMemberResponseDTO(member: IProjectMemberEntity): IProjectMemberEntity {
        return member;
    }

    static toGetAllProjectsResponseDTO(data: {
        projects: IProjectEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }): GetAllProjectsResponseDTO {
        return {
            projects: data.projects,
            total: data.total,
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
        };
    }
}
