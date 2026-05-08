import { inject, injectable } from "tsyringe";
import { IMeetingSummaryRepository } from "../../../domain/interfaces/repositories/MeetingRepo/IMeetingSummaryRepository";
import { IGetMeetingSummaryUseCase } from "../../interface/meeting/IGetMeetingSummaryUseCase";
import { IMeetingSummaryEntity } from "../../../domain/entities/Meeting/IMeetingSummaryEntity";

@injectable()
export class GetMeetingSummaryUseCase implements IGetMeetingSummaryUseCase {
    constructor(
        @inject("IMeetingSummaryRepository")
        private summaryRepo: IMeetingSummaryRepository
    ) {}

    async execute(meetingId: string): Promise<IMeetingSummaryEntity | null> {
        return this.summaryRepo.getSummaryByMeetingId(meetingId);
    }
}
