import { GoogleGenAI } from "@google/genai";
// Load local .env when present (optional). Install dotenv if you plan to use a .env file:
// npm install dotenv
import "dotenv/config";

export async function POST(request: Request,) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: "Missing GEMINI_API_KEY" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
    console.log("Reached POST");
    const { project, selectedOptions } = await request.json();
    const input = `You are an engineering execution planner.
Return ONLY minified valid JSON. No prose, markdown, or extra text.
SCHEMA:
{
"project":{"title":"string"},
"problem":{"statement":"string","constraints":["string"]},
"architecture":{"overview":"string","block_diagram":["string"]},
"components":[{"subsystem":"string","chosen_option":"string","why_chosen":"string","pros":["string"],"cons":["string"]}],
"execution_steps":["string"],
"testing":{"methods":["string"],"success_criteria":"string"},
"references":["string"],
"extensions":["string"],
"cost":"string",
"skills":["string"],
}
RULES:
- All decisions are final; no alternatives.
- Block diagram reflects chosen subsystems only.
- Steps must be practical and ordered.
- Engineering-realistic, concise.
- Nigeria context where relevant.
- Prefer textbooks, datasheets, peer-reviewed sources.
- Simplest working system first; extensions optional.
PROJECT:${JSON.stringify({ title: project })}
CHOICES:${JSON.stringify(selectedOptions)}
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

    console.log("Generated blueprint content:", cleanedText);

    return new Response(JSON.stringify({ output: cleanedText }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
