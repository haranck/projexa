import cron from "node-cron";
import { IUserActivityRepository } from "../../domain/interfaces/repositories/UserActivity/IUserActivityRepository";
import { injectable, inject } from "tsyringe";

@injectable()
export class ActivityResetScheduler {
    constructor(
        @inject("IUserActivityRepository") private readonly userActivityRepository: IUserActivityRepository
    ) { }

    initialize() {
        cron.schedule("0 0 * * 0", async () => {
            try {
                await this.userActivityRepository.resetAllUserActivities();
                console.log(`Successfully reset user activity for all users.`);
            } catch (error) {
                console.error("Error resetting user activity:", error);
            }
        });
    }
}