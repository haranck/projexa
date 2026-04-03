import { injectable } from "tsyringe";
import { IMeetingRepository } from "../../../domain/interfaces/repositories/MeetingRepo/IMeetingRepository";
import { AudioExtractionService } from "../../../infrastructure/services/AudioExtractionService";
import { TranscriptionService } from "../../../infrastructure/services/TranscriptionService";
import { AiSummarizationService } from "../../../infrastructure/services/AiSummarizationService";

@injectable()
export class ProcessMeetingRecordingUseCase {
    constructor(
        private meetingRepo: IMeetingRepository,
        private audioService: AudioExtractionService,
        private transcriptionService: TranscriptionService,
        private aiService: AiSummarizationService
    ) {}

    async execute(meetingId: string, recordingPath: string): Promise<void> {
        try {
            console.log(`Starting processing for meeting: ${meetingId}`);

            // 1. Extract audio
            const audioPath = await this.audioService.extractAudio(recordingPath);
            console.log(`Audio extracted to: ${audioPath}`);

            // 2. Transcribe
            const transcript = await this.transcriptionService.transcribe(audioPath);
            console.log(`Transcription completed.`);

            // 3. Summarize with Gemini
            const { summary, actionItems, decisions } = await this.aiService.generateFinalSummary(transcript);
            console.log(`AI Summary generated.`);

            // 4. Update Meeting in DB
            await this.meetingRepo.updateMeetingRecording(meetingId, {
                recordingUrl: recordingPath, // Should be S3 URL in production
                transcript,
                summary,
                summaryMetadata: {
                    actionItems,
                    decisions
                },
                status: 'completed'
            });

            console.log(`Meeting ${meetingId} updated successfully.`);

            // 5. Cleanup
            await this.audioService.cleanup(audioPath);

        } catch (error) {
            console.error(`Error processing meeting ${meetingId}:`, error);
            await this.meetingRepo.updateMeetingStatus(meetingId, 'cancelled');
            throw error;
        }
    }
}
