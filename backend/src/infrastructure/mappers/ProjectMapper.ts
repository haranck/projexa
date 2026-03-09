import { IProjectEntity } from "../../domain/entities/Project/IProjectEntity";
import { ProjectDocument } from "../database/mongo/models/Project/ProjectModel";

type ProjectMembers = IProjectEntity["members"];

export class ProjectMapper {
    static toEntity(doc: ProjectDocument, members?:ProjectMembers): IProjectEntity {
        return {
            _id: doc._id.toString(),
            projectName: doc.projectName,
            key: doc.key,
            description: doc.description,
            workspaceId: doc.workspaceId.toString(),
            createdBy: doc.createdBy.toString(),
            members: members || [],
            issueCounter: doc.issueCounter,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}