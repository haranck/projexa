import { Queue, Worker, Job } from "bullmq";
import { container, injectable } from "tsyringe";
import { ProcessMeetingRecordingUseCase } from "../../application/useCases/meeting/ProcessMeetingRecordingUseCase";

const QUEUE_NAME = "meeting-processor";
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");

@injectable()
export class MeetingProcessorQueue {
    private queue: Queue;

    constructor() {
        this.queue = new Queue(QUEUE_NAME, {
            connection: {
                host: REDIS_HOST,
                port: REDIS_PORT,
            },
        });

        this.setupWorker();
    }

    async addJob(meetingId: string, recordingPath: string): Promise<void> {
        await this.queue.add("process-recording", { meetingId, recordingPath });
    }

    private setupWorker(): void {
        const worker = new Worker(
            QUEUE_NAME,
            async (job: Job) => {
                const { meetingId, recordingPath } = job.data;
                const useCase = container.resolve(ProcessMeetingRecordingUseCase);
                await useCase.execute(meetingId, recordingPath);
            },
            {
                connection: {
                    host: REDIS_HOST,
                    port: REDIS_PORT,
                },
            }
        );

        worker.on("completed", (job) => {
            console.log(`Job ${job.id} completed successfully`);
        });

        worker.on("failed", (job, err) => {
            console.error(`Job ${job?.id} failed: ${err.message}`);
        });
    }
}
