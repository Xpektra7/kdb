import 'dotenv/config'
import { GoogleGenAI } from "@google/genai";


const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
    console.error(
        "Missing GEMINI_API_KEY. Set the env var or add it to a .env file: GEMINI_API_KEY=AIza..."
    );
    process.exit(1);
}


const ai = new GoogleGenAI({apiKey});

export default ai;