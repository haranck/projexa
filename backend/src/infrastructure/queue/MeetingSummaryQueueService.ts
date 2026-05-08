import { injectable } from "tsyringe";
import { Queue } from "bullmq";
import { redisClient } from "../cache/redisClient";
import {
    IMeetingSummaryQueueService,
    IMeetingSummaryJobData,
} from "../../domain/interfaces/services/IMeetingSummaryQueueService";

const QUEUE_NAME = "meeting-summary";

@injectable()
export class MeetingSummaryQueueService implements IMeetingSummaryQueueService {
    private readonly queue: Queue;

    constructor() {
        this.queue = new Queue(QUEUE_NAME, {
            connection: redisClient,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
                removeOnComplete: { count: 100 },
                removeOnFail: { count: 50 },
            },
        });
    }

    async addSummaryJob(data: IMeetingSummaryJobData): Promise<void> {
        await this.queue.add("generate-summary", data, {
            jobId: `summary-${data.meetingId}`,
        });
    }
}
