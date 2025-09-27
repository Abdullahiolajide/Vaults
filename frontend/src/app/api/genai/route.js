// app/api/genai/route.js
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // Use GoogleGenAI with API key
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GenAI API Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
