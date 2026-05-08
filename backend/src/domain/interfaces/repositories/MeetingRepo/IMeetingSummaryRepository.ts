import { IMeetingSummaryEntity } from "../../../../domain/entities/Meeting/IMeetingSummaryEntity";
import { MeetingSummaryStatus } from "../../../../domain/enums/MeetingSummaryStatus";

export interface IMeetingSummaryRepository {
    createSummary(meetingId: string): Promise<IMeetingSummaryEntity>;
    getSummaryByMeetingId(meetingId: string): Promise<IMeetingSummaryEntity | null>;
    updateSummary(meetingId: string, data: Partial<IMeetingSummaryEntity>): Promise<IMeetingSummaryEntity | null>;
    updateStatus(meetingId: string, status: MeetingSummaryStatus, errorMessage?: string): Promise<void>;
}
