import { IUserActivityEntity } from "../../../entities/UserActivity/IUserActivityEntity";

export interface IUserActivityRepository {
    updateUserActivity(userId: string, duration: number): Promise<void>;
    getUserActivity(userId: string): Promise<IUserActivityEntity | null>;
    resetAllUserActivities(): Promise<void>;
}
