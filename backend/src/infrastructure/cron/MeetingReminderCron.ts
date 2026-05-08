import cron from "node-cron";
import { inject, injectable } from "tsyringe";
import { IMeetingRepository } from "../../domain/interfaces/repositories/MeetingRepo/IMeetingRepository";
import { ISendNotificationUseCase } from "../../application/interface/notification/ISendNotificationUseCase";
import { NotificationEventType } from "../../domain/enums/NotificationEventType";

@injectable()
export class MeetingReminderCron {
    constructor(
        @inject("IMeetingRepository") private meetingRepo: IMeetingRepository,
        @inject("ISendNotificationUseCase") private sendNotification: ISendNotificationUseCase
    ) {}

    public start() {
        cron.schedule("* * * * *", async () => {
            await this.checkUpcomingMeetings();
        });
        console.log("Meeting Reminder Cron started");
    }

    private async checkUpcomingMeetings() {
        try {
            const now = new Date();
            const tenMinutesLater = new Date(now.getTime() + 10 * 60000);
            const elevenMinutesLater = new Date(now.getTime() + 11 * 60000);
            const upcomingMeetings = await this.meetingRepo.getUpcomingMeetings(tenMinutesLater, elevenMinutesLater);

            for (const meeting of upcomingMeetings) {
                for (const participant of meeting.participants) {
                    await this.sendNotification.execute({
                        recipientId: participant.userId,
                        eventType: NotificationEventType.MEETING_REMINDER,
                        message: `Reminder: Meeting "${meeting.title}" starts in 10 minutes.`,
                        resourceId: meeting._id,
                        resourceType: "meeting"
                    });
                }
                await this.meetingRepo.markReminderAsSent(meeting._id!);
            }
        } catch (error) {
            console.error("Error in MeetingReminderCron:", error);
        }
    }
}
