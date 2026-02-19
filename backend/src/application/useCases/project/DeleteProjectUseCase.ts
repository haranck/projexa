import { injectable,inject } from "tsyringe";
import { IDeleteProjectUseCase } from "../../interface/project/IDeleteProjectUseCase";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class DeleteProjectUseCase implements IDeleteProjectUseCase {
    constructor(
        @inject("IProjectRepository") private readonly _projectRepository: IProjectRepository
    ){}

    async execute(projectId: string): Promise<void> {
        const project = await this._projectRepository.getProjectById(projectId);
        if (!project) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
        await this._projectRepository.deleteProject(projectId);
    }
}
