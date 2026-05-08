import { Worker, Job } from "bullmq";
import { redisClient } from "../cache/redisClient";
import { IMeetingSummaryJobData } from "../../domain/interfaces/services/IMeetingSummaryQueueService";
import { MeetingSummaryStatus } from "../../domain/enums/MeetingSummaryStatus";
import { MeetingSummaryRepository } from "../database/mongo/repositories/MeetingRepo/MeetingSummaryRepository";
import { GeminiAIService } from "../services/GeminiAIService";
import { WhisperTranscriptionService } from "../services/WhisperTranscriptionService";
import { MeetingRepository } from "../database/mongo/repositories/MeetingRepo/MeetingRepository";

const QUEUE_NAME = "meeting-summary";

export class MeetingSummaryWorker {
    private worker: Worker | null = null;

    private readonly summaryRepo = new MeetingSummaryRepository();
    private readonly aiService = new GeminiAIService();
    private readonly transcriptionService = new WhisperTranscriptionService();
    private readonly meetingRepo = new MeetingRepository();

    start(): void {
        this.worker = new Worker<IMeetingSummaryJobData>(
            QUEUE_NAME,
            async (job: Job<IMeetingSummaryJobData>) => {
                const { meetingId, meetingTitle, audioUrl, transcript } = job.data;
                console.log(`[MeetingSummaryWorker] Processing job for meeting: ${meetingId}`);

                await this.summaryRepo.updateStatus(meetingId, MeetingSummaryStatus.PROCESSING);

                let finalTranscript = transcript ?? "";

                // Step 1: Transcribe audio if no transcript provided
                if (!finalTranscript && audioUrl) {
                    console.log(`[MeetingSummaryWorker] Transcribing audio for meeting: ${meetingId}`);
                    finalTranscript = await this.transcriptionService.transcribeAudio(audioUrl);
                }

                if (!finalTranscript || finalTranscript.trim().length === 0) {
                    finalTranscript = `Meeting: ${meetingTitle}. No transcript or audio was available for this meeting.`;
                }

                // Step 2: Generate AI summary
                console.log(`[MeetingSummaryWorker] Generating AI summary for meeting: ${meetingId}`);
                const aiResult = await this.aiService.generateMeetingSummary(finalTranscript);

                // Step 3: Persist the result
                await this.summaryRepo.updateSummary(meetingId, {
                    transcript: finalTranscript,
                    summary: aiResult.summary,
                    keyPoints: aiResult.keyPoints,
                    decisions: aiResult.decisions,
                    actionItems: aiResult.actionItems,
                    status: MeetingSummaryStatus.COMPLETED,
                });

                console.log(`[MeetingSummaryWorker] Summary completed for meeting: ${meetingId}`);
            },
            {
                connection: redisClient,
                concurrency: 3,
            }
        );

        this.worker.on("failed", async (job, err) => {
            if (!job) return;
            const { meetingId } = job.data;
            console.error(`[MeetingSummaryWorker] Job failed for meeting ${meetingId}:`, err.message);

            const failedAttempts = job.attemptsMade;
            const maxAttempts = job.opts.attempts ?? 3;
            if (failedAttempts >= maxAttempts) {
                await this.summaryRepo.updateStatus(
                    meetingId,
                    MeetingSummaryStatus.FAILED,
                    err.message
                );
            }
        });

        this.worker.on("completed", (job) => {
            console.log(`[MeetingSummaryWorker] Job ${job.id} completed successfully`);
        });

        console.log("[MeetingSummaryWorker] Worker started and listening for jobs");
    }

    async stop(): Promise<void> {
        if (this.worker) {
            await this.worker.close();
            this.worker = null;
        }
    }
}

export const meetingSummaryWorker = new MeetingSummaryWorker();
