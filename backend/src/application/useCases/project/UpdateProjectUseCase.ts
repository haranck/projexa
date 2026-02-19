import { IUpdateProjectUseCase } from "../../interface/project/IUpdateProjectUseCase";
import { IProjectEntity } from "../../../domain/entities/Project/IProjectEntity";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { injectable, inject } from "tsyringe";
import { UpdateProjectDTO } from "../../dtos/project/requestDTOs/UpdateProjectDTO";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";



@injectable()
export class UpdateProjectUseCase implements IUpdateProjectUseCase {
    constructor(
        @inject("IProjectRepository") private readonly _projectRepository: IProjectRepository,
    ) { }

    async execute(data: UpdateProjectDTO): Promise<IProjectEntity> {
        const project = await this._projectRepository.getProjectById(data.projectId);
        if (!project) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
        const updatedProject = await this._projectRepository.updateProject(data.projectId, data);
        if (!updatedProject) throw new Error(PROJECT_ERRORS.PROJECT_UPDATE_FAILED);
        return updatedProject;
    }
}
