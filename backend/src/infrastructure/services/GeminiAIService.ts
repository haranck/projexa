import { injectable } from "tsyringe";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIService, IAISummaryResult } from "../../domain/interfaces/services/IAIService";
import { env } from "../../config/envValidation";

@injectable()
export class GeminiAIService implements IAIService {
    private readonly model;

    constructor() {
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async generateMeetingSummary(transcript: string): Promise<IAISummaryResult> {
        const prompt = `You are an expert meeting analyst. Analyze the following meeting transcript and extract structured information.

TRANSCRIPT:
${transcript}

Respond ONLY with a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "summary": "A concise 2-3 sentence summary of the entire meeting",
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "decisions": ["decision 1", "decision 2"],
  "actionItems": [
    { "task": "specific task description", "assignee": "person name or null", "dueDate": "due date or null" }
  ]
}

Rules:
- summary: Comprehensive 2-3 sentence overview
- keyPoints: 3-7 most important discussion points
- decisions: Final decisions made during the meeting (can be empty array)
- actionItems: Concrete next steps with owner and deadline if mentioned (can be empty array)`;

        const result = await this.model.generateContent(prompt);
        const text = result.response.text().trim();

        const cleanedText = text
            .replace(/```json\n?/gi, "")
            .replace(/```\n?/gi, "")
            .trim();

        const parsed = JSON.parse(cleanedText) as IAISummaryResult;

        return {
            summary: parsed.summary ?? "",
            keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
            decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
            actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
        };
    }
}
