import { GoogleGenAI } from "@google/genai";

const KEY_ERROR_HINTS = ["quota", "rate limit", "exceeded", "insufficient", "resource_exhausted"];

function parseKeys(): string[] {
  const raw = process.env.GEMINI_API_KEY || "";
  return raw
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

function isQuotaError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  const message = error instanceof Error ? error.message : String(error);
  const lowered = message.toLowerCase();

  if (lowered.includes("429") || lowered.includes("quota") || lowered.includes("rate")) {
    return true;
  }

  return KEY_ERROR_HINTS.some((hint) => lowered.includes(hint));
}

export async function generateWithFallback(input: string) {
  const keys = parseKeys();
  if (keys.length === 0) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  let lastError: unknown;
  for (const key of keys) {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: input,
      });
      return result;
    } catch (error) {
      lastError = error;
      if (!isQuotaError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}
