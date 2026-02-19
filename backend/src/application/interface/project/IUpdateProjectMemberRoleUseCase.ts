import { UpdateProjectMemberRoleDTO } from "../../dtos/project/requestDTOs/UpdateProjectMemberRoleDTO";
import { IProjectMemberEntity } from "../../../domain/entities/Project/IProjectMemberEntity";

export interface IUpdateProjectMemberRoleUseCase {
    execute(data: UpdateProjectMemberRoleDTO): Promise<IProjectMemberEntity>;
}