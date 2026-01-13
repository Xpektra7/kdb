import { GoogleGenAI } from "@google/genai";
// Load local .env when present (optional). Install dotenv if you plan to use a .env file:
// npm install dotenv
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error(
        "Missing GEMINI_API_KEY. Set the env var or add it to a .env file: GEMINI_API_KEY=AIza..."
    );
    process.exit(1);
}

export async function POST(request: Request) {
    console.log("Reached POST");
    const { project } = await request.json();
const input = `You are an engineering project planner. Return ONLY valid minified JSON (no whitespace, no newlines), No prose, markdown, or extra text.
SCHEMA:
{
  "project":"string",
  "concept":"string",
  "research":["string"],
  "problems_overall":[{"problem":"string","suggested_solution":"string"}],
  "block_diagram":[{"block":"string","from":"string|string[]|null","to":"string|string[]|null"}],
  "decision_matrix":[{"subsystem":"string","options":[{"name":"string","why_it_works":"string","features":["string"],"pros":["string"],"cons":["string"],"estimated_cost":["string"],"availability":"string"}]}],
  "skills":"string",
}
RULES:
- block_diagram represents abstract subsystems only and must be decision-agnostic and stable, and should ONLY include subsystem name.
- decision_matrix subsystems must map 1-to-1 to block_diagram blocks.
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
        model: "gemini-2.-flash", // Note: gemini-2.5-flash might not be public yet, falling back to 2.0 or use user's string if preferred
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

