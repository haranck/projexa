import { injectable } from "tsyringe";
import { IMeetingSummaryRepository } from "../../../../../domain/interfaces/repositories/MeetingRepo/IMeetingSummaryRepository";
import { IMeetingSummaryEntity } from "../../../../../domain/entities/Meeting/IMeetingSummaryEntity";
import { MeetingSummaryStatus } from "../../../../../domain/enums/MeetingSummaryStatus";
import {
    MeetingSummaryModel,
    IMeetingSummaryDocument,
} from "../../models/Meeting/MeetingSummaryModel";
import { MeetingSummaryMapper } from "../../../../mappers/MeetingSummaryMapper";

@injectable()
export class MeetingSummaryRepository implements IMeetingSummaryRepository {
    async createSummary(meetingId: string): Promise<IMeetingSummaryEntity> {
        const doc = await MeetingSummaryModel.create({
            meetingId,
            status: MeetingSummaryStatus.PENDING,
            keyPoints: [],
            decisions: [],
            actionItems: [],
        });
        return MeetingSummaryMapper.toEntity(doc as IMeetingSummaryDocument);
    }

    async getSummaryByMeetingId(
        meetingId: string
    ): Promise<IMeetingSummaryEntity | null> {
        const doc = await MeetingSummaryModel.findOne({ meetingId }).lean<IMeetingSummaryDocument>();
        return doc ? MeetingSummaryMapper.toEntity(doc) : null;
    }

    async updateSummary(
        meetingId: string,
        data: Partial<IMeetingSummaryEntity>
    ): Promise<IMeetingSummaryEntity | null> {
        const doc = await MeetingSummaryModel.findOneAndUpdate(
            { meetingId },
            { $set: data },
            { new: true }
        ).lean<IMeetingSummaryDocument>();
        return doc ? MeetingSummaryMapper.toEntity(doc) : null;
    }

    async updateStatus(
        meetingId: string,
        status: MeetingSummaryStatus,
        errorMessage?: string
    ): Promise<void> {
        const update: Record<string, unknown> = { status };
        if (errorMessage) update.errorMessage = errorMessage;
        await MeetingSummaryModel.findOneAndUpdate({ meetingId }, { $set: update });
    }
}
