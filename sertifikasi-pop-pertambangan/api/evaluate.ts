import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const { scenario, answer } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Evaluasi jawaban peserta POP.

Kembalikan HANYA JSON berikut:

{
  "scoreTotal": 0,
  "level": "",
  "rubricScores": {
    "keselamatan": 0,
    "regulasi": 0,
    "keputusan": 0,
    "risiko": 0,
    "kepemimpinan": 0,
    "komunikasi": 0
  },
  "kelebihan": [],
  "kekurangan": [],
  "perspektif": "",
  "contohIdeal": ""
}

Scenario:
${scenario}

Answer:
${answer}
`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return res.status(200).json(
      JSON.parse(response.text || "{}")
    );

  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}
