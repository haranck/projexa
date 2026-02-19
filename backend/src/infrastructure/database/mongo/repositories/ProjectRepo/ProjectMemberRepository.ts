import { IProjectMemberRepository } from "../../../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { AddProjectMemberDTO } from "../../../../../application/dtos/project/requestDTOs/AddProjectMemberDTO";
import { BaseRepo } from "../base/BaseRepo"
import { ProjectMemberModel, ProjectMemberDocument } from "../../models/Project/ProjectMemberModel";
import { injectable } from "tsyringe";
import { ProjectMemberMapper } from "../../../../mappers/ProjectMemberMapper";
import { Model } from "mongoose";
import { IProjectMemberEntity } from "../../../../../domain/entities/Project/IProjectMemberEntity";
import { PROJECT_ERRORS } from "../../../../../domain/constants/errorMessages";
import { UpdateProjectMemberRoleDTO } from "../../../../../application/dtos/project/requestDTOs/UpdateProjectMemberRoleDTO";

@injectable()
export class ProjectMemberRepository extends BaseRepo<IProjectMemberEntity> implements IProjectMemberRepository {
    constructor(){
        super(ProjectMemberModel as unknown as Model<IProjectMemberEntity>)
    }

    async addMemberToProject(projectMember: AddProjectMemberDTO): Promise<IProjectMemberEntity> {
        const id = await super.create({
            projectId: projectMember.projectId,
            userId: projectMember.userId,
            roleId: projectMember.roleId,
        })
        const doc = await super.findById(id)
        if(!doc) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)
        return ProjectMemberMapper.toEntity(doc as unknown as ProjectMemberDocument)
    }

    async getProjectMembers(projectId: string): Promise<IProjectMemberEntity[]> {
        const docs = await ProjectMemberModel.find({ projectId })
        return docs.map(doc => ProjectMemberMapper.toEntity(doc as unknown as ProjectMemberDocument))
    }

    async getProjectMemberById(projectMemberId: string): Promise<IProjectMemberEntity | null> {
        const docs = await ProjectMemberModel.findById(projectMemberId)
        return docs ? ProjectMemberMapper.toEntity(docs as unknown as ProjectMemberDocument) : null
    }

    async updateProjectMemberRole(data: UpdateProjectMemberRoleDTO): Promise<IProjectMemberEntity> {
        const updatedDoc = await ProjectMemberModel.findOneAndUpdate(
            {projectId:data.projectId,userId:data.userId},
            {roleId:data.roleId},
            {new:true}
        ).lean()

        if(!updatedDoc) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)
        return ProjectMemberMapper.toEntity(updatedDoc as unknown as ProjectMemberDocument)

    }

    async removeMember(projectMemberId: string): Promise<void> {
        await super.deleteById(projectMemberId)
    }

    async findProjectAndUser(projectId: string, userId: string): Promise<IProjectMemberEntity | null> {
        const doc = await ProjectMemberModel.findOne({projectId,userId})
        return doc ? ProjectMemberMapper.toEntity(doc as unknown as ProjectMemberDocument) : null
    }

    async findByProjectId(projectId: string): Promise<IProjectMemberEntity[]> {
        const docs = await ProjectMemberModel.find({ projectId })
        return docs.map(doc => ProjectMemberMapper.toEntity(doc as unknown as ProjectMemberDocument))
    }
}
