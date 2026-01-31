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
  
  // Try to extract a balanced JSON object
  const startIndex = cleanedText.indexOf('{');
  if (startIndex !== -1) {
    let depth = 0;
    let endIndex = -1;
    
    for (let i = startIndex; i < cleanedText.length; i++) {
      if (cleanedText[i] === '{') depth++;
      else if (cleanedText[i] === '}') depth--;
      
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
    
    if (endIndex !== -1) {
      cleanedText = cleanedText.substring(startIndex, endIndex + 1);
    }
  }
  
  // Validate the JSON before returning
  try {
    const parsed = JSON.parse(cleanedText);
    console.log("Generated build guide content (valid JSON)");
    
    return new Response(JSON.stringify({ output: parsed }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (parseError) {
    console.error("Failed to parse AI response as JSON:", parseError);
    console.error("Cleaned text length:", cleanedText.length);
    console.error("Cleaned text (first 500 chars):", cleanedText.substring(0, 500));
    console.error("Cleaned text (last 500 chars):", cleanedText.substring(cleanedText.length - 500));
    
    return new Response(JSON.stringify({ error: "Invalid JSON response from AI. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

