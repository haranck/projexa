import { IProjectEntity } from "../../domain/entities/Project/IProjectEntity";
import { ProjectDocument } from "../database/mongo/models/Project/ProjectModel";

export class ProjectMapper {
    static toEntity(doc: ProjectDocument): IProjectEntity {
        return {
            _id: doc._id.toString(),
            projectName: doc.projectName,
            key: doc.key,
            description: doc.description,
            workspaceId: doc.workspaceId.toString(),
            createdBy: doc.createdBy.toString(),
            members: doc.members ? doc.members.map((m: { userId: { toString: () => string }, roleId: { toString: () => string }, joinedAt: Date }) => ({
                userId: m.userId.toString(),
                roleId: m.roleId.toString(),
                joinedAt: m.joinedAt
            })) : [],
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}