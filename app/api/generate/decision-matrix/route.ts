import { GoogleGenAI } from "@google/genai";
// Load local .env when present (optional). Install dotenv if you plan to use a .env file:
// npm install dotenv
import "dotenv/config";

export async function POST(request: Request) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: "Missing GEMINI_API_KEY" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
    console.log("Reached POST");
    const { project } = await request.json();
    const input = `You are an engineering project planner. Return ONLY valid minified JSON (no newlines), No prose, markdown, or extra text.
SCHEMA:
{
  "project":"string",
  "concept":"string",
  "research":["string"],
  "goals":["string"],
  "problems_overall":[{"problem":"string","suggested_solution":"string"}],
  "subsystems":[{"subsystem":"string","inputFrom":"string|string[]|null","outputTo":"string|string[]|null","options":[{"name":"string","why_it_works":"string","features":["string"],"pros":["string"],"cons":["string"],"estimated_cost":"string","availability":"string"}]}],
  "skills":"string",
}
RULES:
- Omit subsystems with no viable options.
- Engineering systems only.
- Provide 2–4 options per subsystem with real tradeoffs.
- Keep output concise and execution-focused.
- Prefer textbooks or peer-reviewed sources.
- Describe the simplest viable system; extras are optional.
PROJECT:
${project}
LOCATION:
Nigeria
`;

    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({apiKey});

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: input,
    });

    const text = result.text;

    // Clean up markdown code blocks if present in the output
    const cleanedText = text ? text.replace(/```json\n|\n```/g, "").trim() : "";

    return new Response(JSON.stringify({ output: cleanedText }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
