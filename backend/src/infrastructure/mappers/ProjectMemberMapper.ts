import {IProjectMemberEntity} from "../../domain/entities/Project/IProjectMemberEntity";
import {ProjectMemberDocument} from "../database/mongo/models/Project/ProjectMemberModel";

export class ProjectMemberMapper {
    static toEntity(doc: ProjectMemberDocument): IProjectMemberEntity {
        return {
            _id: doc._id.toString(),
            projectId: doc.projectId.toString(),
            userId: doc.userId.toString(),
            roleId: doc.roleId.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}