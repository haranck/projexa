import { IMeetingRepository } from "../../../../../domain/interfaces/repositories/MeetingRepo/IMeetingRepository";
import { IMeetingEntity } from "../../../../../domain/entities/Meeting/IMeetingEntity";
import { injectable } from "tsyringe";
import { BaseRepo } from "../base/BaseRepo";
import { MeetingModel, IMeetingDocument } from "../../models/Meeting/MeetingModel";
import { Model } from "mongoose";
import { MeetingMapper } from "../../../../mappers/MeetingMapper";
import { MEETING_ERRORS } from "../../../../../domain/constants/errorMessages";

@injectable()
export class MeetingRepository extends BaseRepo<IMeetingEntity> implements IMeetingRepository {
    constructor() {
        super(MeetingModel as unknown as Model<IMeetingEntity>);
    }
    
    async createMeeting(meeting: IMeetingEntity): Promise<IMeetingEntity> {
        const id = await super.create(meeting);
        const doc = await super.findById(id);
        if (!doc) throw new Error(MEETING_ERRORS.MEETING_CREATION_FAILED);
        return MeetingMapper.toEntity(doc as unknown as IMeetingDocument);
    }

    async getMeetingById(id: string): Promise<IMeetingEntity | null> {
        const doc = await super.findById(id);
        if (!doc) return null;
        return MeetingMapper.toEntity(doc as unknown as IMeetingDocument);
    }

    async getMeetingsByProjectId(projectId: string): Promise<IMeetingEntity[]> {
        const docs = await this.model.find({projectId}).lean<IMeetingDocument[]>();
        return docs.map((doc) => MeetingMapper.toEntity(doc));
    }

    async updateMeetingStatus(meetingId: string, status: string): Promise<IMeetingEntity | null> {
        const doc = await this.model.findByIdAndUpdate(
            meetingId,
            { status },
            { new: true }
        ).lean<IMeetingDocument>();
        return doc ? MeetingMapper.toEntity(doc) : null;
    }

    async updateParticipantStatus(
        meetingId: string,
        userId: string,
        status: 'joined' | 'left' | 'missed'
    ): Promise<IMeetingEntity | null> {
        const updateData: Record<string, string | Date> = {
            "participants.$.status": status
        };

        if (status === 'joined') updateData["participants.$.joinedAt"] = new Date();
        if (status === 'left') updateData["participants.$.leftAt"] = new Date();

        const doc = await this.model.findOneAndUpdate(
            { _id: meetingId, "participants.userId": userId },
            { $set: updateData },
            { new: true }
        ).lean<IMeetingDocument>();

        return doc ? MeetingMapper.toEntity(doc) : null;
    }

    async updateMeeting(meetingId: string, meeting: Partial<IMeetingEntity>): Promise<IMeetingEntity | null> {
        const doc = await this.model.findByIdAndUpdate(
            meetingId,
            { $set: meeting },
            { new: true }
        ).lean<IMeetingDocument>();

        return doc ? MeetingMapper.toEntity(doc) : null;
    }
}
