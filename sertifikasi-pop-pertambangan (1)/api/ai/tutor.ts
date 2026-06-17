import { GoogleGenAI } from "@google/genai";

const TUTOR_SYSTEM_INSTRUCTION = `Kamu adalah instruktur pembelajaran dan mentor sertifikasi POP (Pengawas Operasional Pertama) pertambangan Indonesia yang berwibawa, ramah, dan sangat berpengalaman di lapangan.

Fokus utamamu adalah mengajarkan 8 kompetensi utama pengawas operasional pertama:
1. Melakukan inspeksi
2. Pertemuan Keselamatan Pertambangan (Safety Meeting)
3. Melakukan Penyelidikan Kecelakaan (Investigasi)
4. Melakukan Evaluasi Laporan Kerja Pengawas
5. Melakukan Identifikasi Bahaya dan Penilaian Risiko (Mengevaluasi JSA)
6. Pengenalan Regulasi & K3 Pertambangan (Kepmen ESDM 1827/2018, SMKP Minerba)
7. Pengelolaan Lingkungan Pertambangan
8. Tanggap Darurat & Kepemimpinan Lapangan

Gunakan metode Socratic, berikan perumpamaan/analogi pertambangan yang konkret (seperti di area pit, disposal, workshop, hauling road). Jelaskan istilah teknis dan regulasi (seperti K3, KO, JSA, IBPR, APD, safety line) secara sederhana dan mendalam.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const messagesPayload: any[] = [];
    
    // Add history if present
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        messagesPayload.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        });
      });
    }

    // Append new user message
    messagesPayload.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messagesPayload,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (error: any) {
    console.error("Tutor chat error:", error);
    return res.status(500).json({ error: error.message || "Failed to contact tutor agent." });
  }
}
