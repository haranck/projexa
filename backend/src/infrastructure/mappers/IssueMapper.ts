import { IssueDocument } from "../database/mongo/models/Issue/IssueModel";
import { IIssueEntity } from "../../domain/entities/Issue/IIssueEntity";

export class IssueMapper {
    static toEntity(doc:IssueDocument):IIssueEntity {
        return {
            _id: doc._id.toString(),
            workspaceId: doc.workspaceId,
            projectId: doc.projectId.toString(),
            parentIssueId: doc.parentIssueId?.toString() || null,
            sprintId: doc.sprintId?.toString() || null,
            key: doc.key,
            title: doc.title,
            description: doc.description ?? undefined,
            issueType: doc.issueType,
            status: doc.status,
            attachments: doc.attachments || [],
            assigneeId: doc.assigneeId?.toString() || null,
            startDate: doc.startDate || null,
            endDate: doc.endDate || null,
            comments: (doc.comments || []).map(c => ({
                userId: c.userId,
                userName: c.userName,
                text: c.text,
                mentions: c.mentions?.map(m => m.toString()) || [],
                createdAt: c.createdAt
            })),
            createdBy: doc.createdBy.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        }
    }
}