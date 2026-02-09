import { GoogleGenAI } from "@google/genai";
// Load local .env when present (optional). Install dotenv if you plan to use a .env file:
// npm install dotenv
import "dotenv/config";

async function retry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delayMs?: number } = {}
): Promise<T> {
  const { retries = 3, delayMs = 300 } = options;
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fn();
      console.log(res);
      return res;
    } catch (error: any) {
      lastError = error;

      // Don't retry on quota/rate limit errors (429) - surface immediately
      if (error?.code === 429 || error?.status === "RESOURCE_EXHAUSTED") {
        throw error;
      }

      if (attempt < retries && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}

function extractJsonObject(text: string): string | null {
  const startIndex = text.indexOf("{");
  if (startIndex === -1) {
    return null;
  }

  let depth = 0;
  let endIndex = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") depth++;
    else if (char === "}") depth--;

    if (depth === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return null;
  }

  return text.substring(startIndex, endIndex + 1);
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing GEMINI_API_KEY" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  console.log("Reached POST");
  const { project, blueprint } = await request.json();
  const input = `You are an engineering build guide generator.
Return ONLY minified valid JSON. No prose, markdown, or extra text.
SCHEMA:
{
"project":"string",
"build_overview":"string",
"prerequisites":{"tools":["string"],"materials":["string"]},
"wiring":{"description":"string","connections":["string"]},
"firmware":{"language":"string","structure":["string"],"key_logic":["string"]},
"calibration":["string"],
"testing":{"unit":["string"],"integration":["string"],"acceptance":["string"]},
"common_failures":[{"issue":"string","cause":"string","fix":"string"}],
"safety":["string"],
"next_steps":["string"]
}
RULES:
- Blueprint decisions are final; do NOT redesign.
- No alternatives, no options, no comparisons.
- Steps must be executable by a single builder.
- Use clear, hardware-level language.
- Assume Nigeria context where relevant.
- Avoid pin numbers unless unavoidable; keep board-agnostic where possible.
- Prefer datasheets and official docs.
- Focus on getting a first working prototype.
PROJECT:${project}
BLUEPRINT:${JSON.stringify(blueprint)}
`;

  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
  const ai = new GoogleGenAI({ apiKey });

  try {
    const parsed = await retry(async () => {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Note: gemini-2.5-flash might not be public yet, falling back to 2.0 or use user's string if preferred
        contents: input,
      });

      const text = result.text;

      // Clean up markdown code blocks and extract valid JSON
      let cleanedText = text || "";

      // Remove markdown code blocks (various formats)
      cleanedText = cleanedText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      const extractedJson = extractJsonObject(cleanedText);
      if (!extractedJson) {
        throw new Error("No JSON object found in response");
      }

      cleanedText = extractedJson;

      // Validate the JSON before returning
      try {
        const parsedResponse = JSON.parse(cleanedText);
        console.log({ parsed: parsedResponse, cleanedText });
        console.log("Generated build guide content (valid JSON)");
        return parsedResponse;
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        console.error("Cleaned text length:", cleanedText.length);
        console.error("Cleaned text (first 500 chars):", cleanedText.substring(0, 500));
        console.error(
          "Cleaned text (last 500 chars):",
          cleanedText.substring(cleanedText.length - 500)
        );
        throw parseError;
      }
    }, { retries: 3, delayMs: 300 });

    return new Response(JSON.stringify({ output: parsed }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // Handle quota/rate limit errors
    if (error?.code === 429 || error?.status === "RESOURCE_EXHAUSTED") {
      console.error("Gemini API quota exceeded:", error.message);
      return new Response(
        JSON.stringify({
          error: "AI service temporarily unavailable due to rate limits. Please try again later.",
          details: error.message
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Re-throw other errors to be handled by outer catch
    throw error;
  }
}
