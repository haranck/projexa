import { IProjectMemberEntity } from "../../../domain/entities/Project/IProjectMemberEntity";
import { AddProjectMemberDTO } from "../../dtos/project/requestDTOs/AddProjectMemberDTO";

export interface IAddProjectMemberUseCase {
    execute(projectMember: AddProjectMemberDTO): Promise<IProjectMemberEntity>;
}
