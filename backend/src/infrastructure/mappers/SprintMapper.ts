import { ISprintEntity } from "../../domain/entities/Sprint/ISprintEntity";
import { SprintDocument } from "../database/mongo/models/Sprint/SprintModel";

export class SprintMapper {
    static toEntity(doc: SprintDocument): ISprintEntity {
        return {
            _id: doc._id.toString(),
            workspaceId: doc.workspaceId,
            projectId: doc.projectId,
            name: doc.name,
            goal: doc.goal ?? undefined,
            startDate: doc.startDate ?? null,
            endDate: doc.endDate ?? null,
            status: doc.status,
            createdBy: doc.createdBy,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

}