import { injectable } from "tsyringe";
import OpenAI from "openai";
import { ITranscriptionService } from "../../domain/interfaces/services/ITranscriptionService";
import { env } from "../../config/envValidation";

@injectable()
export class WhisperTranscriptionService implements ITranscriptionService {
    private readonly openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }

    async transcribeAudio(audioUrl: string): Promise<string> {
        const response = await fetch(audioUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch audio from URL: ${audioUrl}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const file = new File([buffer], "audio.webm", { type: "audio/webm" });

        const transcription = await this.openai.audio.transcriptions.create({
            file,
            model: "whisper-1",
            response_format: "text",
        });

        return transcription as unknown as string;
    }
}
