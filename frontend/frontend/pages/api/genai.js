import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  const { prompt } = req.body;

  // Make sure key is available server-side, not in browser
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return res.status(200).json({ text: response.text });
}
