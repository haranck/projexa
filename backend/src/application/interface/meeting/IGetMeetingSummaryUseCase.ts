import { IMeetingSummaryEntity } from "../../domain/entities/Meeting/IMeetingSummaryEntity";

export interface IGetMeetingSummaryUseCase {
    execute(meetingId: string): Promise<IMeetingSummaryEntity | null>;
}
