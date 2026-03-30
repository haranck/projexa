import { injectable } from "tsyringe";
import { UserActivityModel } from "../../models/UserActivity/UserActivityModel";
import { IUserActivityRepository } from "../../../../../domain/interfaces/repositories/UserActivity/IUserActivityRepository";
import { IUserActivityEntity } from "../../../../../domain/entities/UserActivity/IUserActivityEntity";
import { BaseRepo } from "../base/BaseRepo";
import { Model } from "mongoose";

@injectable()
export class UserActivityRepository extends BaseRepo<IUserActivityEntity> implements IUserActivityRepository {
    constructor() {
        super(UserActivityModel as unknown as Model<IUserActivityEntity>);
    }

    async updateUserActivity(userId: string, duration: number): Promise<void> {
        await UserActivityModel.findOneAndUpdate(
            { userId },
            {
                $inc: { totalTime: duration },
                $set: { lastUpdated: new Date() }
            },
            { upsert: true }
        );
    }

    async getUserActivity(userId: string): Promise<IUserActivityEntity | null> {
        return await UserActivityModel.findOne({ userId });
    }

    async resetAllUserActivities(): Promise<void> {
        await UserActivityModel.updateMany({}, { $set: { totalTime: 0, lastUpdated: new Date() } });
    }
}
