export interface ITranscriptionService {
    transcribeAudio(audioUrl: string): Promise<string>;
}
