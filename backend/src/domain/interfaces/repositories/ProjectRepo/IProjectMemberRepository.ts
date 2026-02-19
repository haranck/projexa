import { IProjectMemberEntity } from "../../../entities/Project/IProjectMemberEntity";
import { AddProjectMemberDTO } from "../../../../application/dtos/project/requestDTOs/AddProjectMemberDTO";
import { UpdateProjectMemberRoleDTO } from "../../../../application/dtos/project/requestDTOs/UpdateProjectMemberRoleDTO";

export interface IProjectMemberRepository {
    addMemberToProject(projectMember: AddProjectMemberDTO): Promise<IProjectMemberEntity>;
    getProjectMembers(projectId: string): Promise<IProjectMemberEntity[]>;
    getProjectMemberById(projectMemberId: string): Promise<IProjectMemberEntity | null>;
    removeMember(projectMemberId: string): Promise<void>;
    findProjectAndUser(projectId: string, userId: string): Promise<IProjectMemberEntity | null>;
    updateProjectMemberRole(data: UpdateProjectMemberRoleDTO): Promise<IProjectMemberEntity>;
    findByProjectId(projectId: string): Promise<IProjectMemberEntity[]>;
}