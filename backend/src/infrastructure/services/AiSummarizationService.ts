import { injectable } from "tsyringe";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

@injectable()
export class AiSummarizationService {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async summarize(text: string): Promise<string> {
        const prompt = `
        Summarize this meeting transcript:

        * Key points
        * Important discussions
        
        Transcript:
        ${text}
        `;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    async generateFinalSummary(transcript: string): Promise<{ summary: string; actionItems: string[]; decisions: string[] }> {
        const prompt = `
        Create a final structured meeting summary from this transcript. 
        Format the response as a JSON string with the following keys: "summary", "actionItems", "decisions".
        
        Transcript:
        ${transcript}
        `;

        const result = await this.model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Basic JSON parsing logic (in case the response includes markdown blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const finalJson = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: responseText, actionItems: [], decisions: [] };

        return finalJson;
    }

    // Helper to chunk text if it's too long for a single prompt
    chunkText(text: string, size: number = 3000): string[] {
        const chunks: string[] = [];
        for (let i = 0; i < text.length; i += size) {
            chunks.push(text.slice(i, i + size));
        }
        return chunks;
    }
}
