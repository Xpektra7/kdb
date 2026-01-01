import OpenAI from "openai";
// Load local .env when present (optional). Install dotenv if you plan to use a .env file:
// npm install dotenv
import 'dotenv/config';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error(
        "Missing OPENAI_API_KEY. Set the env var or add it to a .env file: OPENAI_API_KEY=sk-..."
    );
    process.exit(1);
}

export async function POST(request: Request) {
    console.log("Reached POST");
    const { project } = await request.json();
    const input = `You are an engineering project planning assistant. Given the project title and location below, output ONLY valid JSON matching this schema exactly—no prose, no markdown, no comments.
                    SCHEMA:
                    {
                    "project": "string",
                    "concept": "string",
                    "research": ["string"],
                    "problems_overall": [
                        { "problem": "string", "suggested_solution": "string" }
                    ],
                    "decision_matrix": [
                        {
                        "subsystem": "string",
                        "options": [
                            {
                            "name": "string",
                            "why_it_works": "string",
                            "features": ["string"],
                            "pros": ["string"],
                            "cons": ["string"],
                            "estimated_cost": ["string"],
                            "availability": "string"
                            }
                        ]
                        }
                    ],
                    "skills": "string",
                    "suggestions": ["string"],
                    }

                    RULES:
                    - Engineering systems only.
                    - Subsystems must reflect an abstract block diagram (e.g., sensing, control, power, actuation, communication, or any other system in the block diagram. If any of the listed system are not applicable, don't include them).
                    - Provide 2–4 options per subsystem with real tradeoffs.
                    - Keep content concise and execution-focused.
                    - Assume the user is in <LOCATION>. Reflect local availability and approximate cost in location currency for each option.
                    - Prioritize standard, well-known textbooks, or peer-reviewed papers over random blogs or forum content.
                    - Describe the simplest viable system that satisfies the title. Extra features must be optional add-ons, not core behavior.
                    - Keep the suggestions to items that are critical to project success or can make it satisfy concept better( 5 max ).

                    PROJECT TITLE:
                    ${project}

                    LOCATION:
                    "Nigeria"
                    `
        ;

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
        model: "gpt-5-nano",
        input: input,
    });

    return new Response(JSON.stringify({ output: response.output_text }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

