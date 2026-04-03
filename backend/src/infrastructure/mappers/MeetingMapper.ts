import { IMeetingEntity } from "../../domain/entities/Meeting/IMeetingEntity";
import { IMeetingDocument } from "../database/mongo/models/Meeting/MeetingModel";

export class MeetingMapper {
    static toEntity(doc: IMeetingDocument): IMeetingEntity {
        return {
            _id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            startTime: doc.startTime,
            endTime: doc.endTime,
            projectId: doc.projectId.toString(),
            hostId: doc.hostId.toString(),
            participants: doc.participants.map((participant) => ({
                userId: participant.userId.toString(),
                status: participant.status,
                joinedAt: participant.joinedAt,
                leftAt: participant.leftAt
            })),
            status: doc.status,
            roomName: doc.roomName,
        }
    }
}