import { GoogleGenAI } from "@google/genai";

import { env } from "../config/env.js";
import { buildCrmExtractionPrompt } from "../prompts/crm-extraction.prompt.js";
import {
  aiCrmBatchSchema,
  type AiCrmRecord,
} from "../schemas/server/src/crm.schema.js";
import { geminiCrmResponseSchema } from "../schemas/server/src/gemini-response.schema.js";
import type { IndexedCsvRow } from "../services/csv.service.js";
import type { AiProvider } from "./ai-provider.js";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export class GeminiProvider implements AiProvider {
  async extractBatch(
    records: IndexedCsvRow[],
  ): Promise<AiCrmRecord[]> {
    if (records.length === 0) {
      return [];
    }

    const response = await ai.models.generateContent({
      model: env.GEMINI_MODEL,

      contents: buildCrmExtractionPrompt(records),

      config: {
        responseMimeType: "application/json",
        responseJsonSchema: geminiCrmResponseSchema,
        temperature: 0,
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error(
        "Gemini returned an empty response.",
      );
    }

    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(responseText);
    } catch {
      throw new Error(
        "Gemini returned invalid JSON.",
      );
    }

    const validated =
      aiCrmBatchSchema.safeParse(parsedJson);

    if (!validated.success) {
      console.error(
        "Gemini response validation failed:",
        validated.error.flatten(),
      );

      throw new Error(
        "Gemini returned data that does not match the CRM schema.",
      );
    }

    return validated.data;
  }
}

export const geminiProvider = new GeminiProvider();