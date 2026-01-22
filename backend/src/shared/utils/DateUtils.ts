import { PlanInterval } from "../../domain/enums/PlanInterval";

export const calculateEndDate = (startDate: Date, interval: PlanInterval): Date => {
    const endDate = new Date(startDate);

    if (interval === PlanInterval.MONTHLY) {
        endDate.setMonth(startDate.getMonth() + 1);
    } else if (interval === PlanInterval.YEARLY) {
        endDate.setFullYear(startDate.getFullYear() + 1);
    }

    return endDate;
};
