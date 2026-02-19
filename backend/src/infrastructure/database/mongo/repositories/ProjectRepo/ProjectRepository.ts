import { IProjectRepository } from "../../../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { ProjectDocument, ProjectModel } from "../../models/Project/ProjectModel";
import { ProjectMemberModel, ProjectMemberDocument } from "../../models/Project/ProjectMemberModel";
import { injectable } from "tsyringe";
import { BaseRepo } from "../base/BaseRepo";
import { Model, Types } from "mongoose";
import { IProjectEntity } from "../../../../../domain/entities/Project/IProjectEntity";
import { CreateProjectDTO } from "../../../../../application/dtos/project/requestDTOs/CreateProjectDTO";
import { UpdateProjectDTO } from "../../../../../application/dtos/project/requestDTOs/UpdateProjectDTO";
import { PROJECT_ERRORS } from "../../../../../domain/constants/errorMessages";
import { ProjectMapper } from "../../../../mappers/ProjectMapper";
import { GetAllProjectsDTO } from "../../../../../application/dtos/project/requestDTOs/GetAllProjectsDTO";
import { GetAllProjectsResponseDTO } from "../../../../../application/dtos/project/responseDTOs/GetAllProjectsResponseDTO";
// import { FilterQuery } from "mongoose";


@injectable()
export class ProjectRepository extends BaseRepo<IProjectEntity> implements IProjectRepository {
    constructor() {
        super(ProjectModel as unknown as Model<IProjectEntity>)
    }

    async createProject(project: CreateProjectDTO): Promise<IProjectEntity> {
        const id = await super.create({
            projectName: project.projectName,
            key: project.key,
            description: project.description,
            workspaceId: project.workspaceId,
            createdBy: project.createdBy,
            members: project.members ? project.members.map((m: { userId: string, roleId: string }) => ({
                userId: m.userId,
                roleId: m.roleId,
                joinedAt: new Date()
            })) : []
        })
        const doc = await super.findById(id)
        if (!doc) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
        return ProjectMapper.toEntity(doc as unknown as ProjectDocument)
    }

    async getProjectById(id: string): Promise<IProjectEntity | null> {
        const doc = await super.findById(id)
        return doc ? ProjectMapper.toEntity(doc as unknown as ProjectDocument) : null
    }

    async getProjectByWorkspaceId(workspaceId: string): Promise<IProjectEntity[]> {
        const docs = await ProjectModel.find({ workspaceId })
        return docs.map(doc => ProjectMapper.toEntity(doc as unknown as ProjectDocument))
    }

    async updateProject(id: string, project: UpdateProjectDTO): Promise<IProjectEntity | null> {
        const doc = await super.update({
            projectName: project.projectName,
            key: project.key,
            description: project.description
        }, id)
        return doc ? ProjectMapper.toEntity(doc as unknown as ProjectDocument) : null
    }

    async getProjectByKey(workspaceId: string, key: string): Promise<IProjectEntity | null> {
        const doc = await ProjectModel.findOne({ workspaceId, key })
        return doc ? ProjectMapper.toEntity(doc as unknown as ProjectDocument) : null
    }

    async deleteProject(id: string): Promise<IProjectEntity | null> {
        const doc = await super.deleteById(id)
        return doc ? ProjectMapper.toEntity(doc as unknown as ProjectDocument) : null
    }

    async getAllProjects(params: GetAllProjectsDTO): Promise<GetAllProjectsResponseDTO> {
        const { workspaceId, page, limit, search } = params;

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 5;

        const query: Record<string, unknown> = { workspaceId: new Types.ObjectId(workspaceId) };

        if (search) {
            query.$or = [
                { projectName: { $regex: search, $options: 'i' } },
                { key: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (pageNumber - 1) * limitNumber;

        const [projects, total] = await Promise.all([
            ProjectModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            ProjectModel.countDocuments(query)
        ]);

        // Minimal and good working code to get up-to-date members
        const projectsWithMembers = await Promise.all(projects.map(async (project) => {
            const members = await ProjectMemberModel.find({ projectId: project._id }).lean<ProjectMemberDocument[]>();
            return {
                ...project,
                members: members.map((m: ProjectMemberDocument) => ({
                    userId: m.userId.toString(),
                    roleId: m.roleId.toString(),
                    joinedAt: m.createdAt
                }))
            };
        }));

        return {
            projects: projectsWithMembers.map(p => ProjectMapper.toEntity(p as unknown as ProjectDocument)),
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber)
        };
    }

}