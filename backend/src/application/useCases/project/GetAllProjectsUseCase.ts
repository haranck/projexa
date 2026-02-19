import { inject, injectable } from "tsyringe";
import { IGetAllProjectsUseCase } from "../../interface/project/IGetAllProjectsUseCase";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { GetAllProjectsDTO } from "../../dtos/project/requestDTOs/GetAllProjectsDTO";
import { GetAllProjectsResponseDTO } from "../../dtos/project/responseDTOs/GetAllProjectsResponseDTO";


@injectable()
export class GetAllProjectsUseCase implements IGetAllProjectsUseCase {
    constructor(
        @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    ) { }

    async execute(params: GetAllProjectsDTO): Promise<GetAllProjectsResponseDTO> {
        const projects = await this._projectRepo.getAllProjects(params);
        return {
            projects: projects.projects,
            total: projects.total,
            page: projects.page,
            limit: projects.limit,
            totalPages: projects.totalPages,
        };
    }
}
