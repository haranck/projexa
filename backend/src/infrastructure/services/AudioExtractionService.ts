import { injectable } from "tsyringe";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

@injectable()
export class AudioExtractionService {
    async extractAudio(inputPath: string): Promise<string> {
        const outputPath = inputPath.replace(path.extname(inputPath), ".mp3");

        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat("mp3")
                .on("end", () => resolve(outputPath))
                .on("error", (err) => reject(err))
                .save(outputPath);
        });
    }

    async cleanup(filePath: string): Promise<void> {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
