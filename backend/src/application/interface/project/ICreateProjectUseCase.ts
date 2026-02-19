import { IProjectEntity } from "../../../domain/entities/Project/IProjectEntity";
import { CreateProjectDTO } from "../../dtos/project/requestDTOs/CreateProjectDTO";

export interface ICreateProjectUseCase {
    execute(project: CreateProjectDTO): Promise<IProjectEntity>;
}