import { IMeetingSummaryEntity } from "../../domain/entities/Meeting/IMeetingSummaryEntity";
import { IMeetingSummaryDocument } from "../database/mongo/models/Meeting/MeetingSummaryModel";

export class MeetingSummaryMapper {
    static toEntity(doc: IMeetingSummaryDocument): IMeetingSummaryEntity {
        return {
            _id: doc._id.toString(),
            meetingId: doc.meetingId,
            transcript: doc.transcript,
            summary: doc.summary,
            keyPoints: doc.keyPoints,
            decisions: doc.decisions,
            actionItems: doc.actionItems.map((item) => ({
                task: item.task,
                assignee: item.assignee,
                dueDate: item.dueDate,
            })),
            status: doc.status,
            errorMessage: doc.errorMessage,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
