import { injectable } from "tsyringe";
import OpenAI from "openai";
import fs from "fs";

@injectable()
export class TranscriptionService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async transcribe(filePath: string): Promise<string> {
        const response = await this.openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
        });

        return response.text;
    }
}
