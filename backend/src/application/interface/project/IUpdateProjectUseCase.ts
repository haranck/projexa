import { UpdateProjectDTO } from "../../dtos/project/requestDTOs/UpdateProjectDTO";
import { IProjectEntity } from "../../../domain/entities/Project/IProjectEntity";

export interface IUpdateProjectUseCase {
    execute(data: UpdateProjectDTO): Promise<IProjectEntity>;
}
