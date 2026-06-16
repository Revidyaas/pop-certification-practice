import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import evaluateHandler from "./api/evaluate";

dotenv.config();

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
app.use(express.json());

// System prompt for POP Senior Assessor
const ASSESSMENT_SYSTEM_INSTRUCTION = `Kamu adalah assessor senior sertifikasi POP (Pengawas Operasional Pertama) yang telah berpengalaman lebih dari 20 tahun di industri pertambangan Indonesia (sesuai Kepmen ESDM No. 1827 K/30/MEM/2018).

Tugasmu adalah menguji kompetensi, pola pikir kritis, kepemimpinan keselamatan, manajemen risiko (IBPR / HIRADC), pemahaman SMKP Minerba, dan pengambilan keputusan di lapangan bagi para pengawas tambang operasional pertama.

Kamu bersikap profesional, objektif, edukatif, dan tegas. Ketika mengevaluasi jawaban pengguna, berikan feedback yang konstruktif dan nilai berdasarkan rubrik berikut secara objektif:
1. Keselamatan (Skor 0-100)
2. Kepatuhan Regulasi (Skor 0-100)
3. Identifikasi Risiko (Skor 0-100)
4. Pengambilan Keputusan (Skor 0-100)
5. Kepemimpinan (Skor 0-100)
6. Komunikasi (Skor 0-100)

Output evaluasi HARUS dalam format JSON yang terstruktur.`;

// Endpoint: Generate dynamic HOTS scenario / question based on selected topic
app.post("/api/ai/scenario", async (req, res) => {
  try {
    const { topic } = req.body;
    const prompt = `Hasilkan satu studi kasus atau skenario HOTS (Higher Order Thinking Skills) pertambangan nyata untuk pengawas operasional pertama (POP) tentang topik: ${topic || 'Umum / Campuran'}.
    
    Skenario harus menempatkan pengguna sebagai pengawas operasional di lapangan (misal: di tambang terbuka, tambang bawah tanah, hauling road, pabrik pengolahan, workshop atau stockpile) yang dihadapkan pada dilema operasi tinggi vs keselamatan, pelanggaran regulasi, cedera ringan, cuaca buruk, kegagalan lereng/longsor, near miss alat berat, atau bahaya lingkungan.
    
    Berikan deskripsi detail situasi lapangan yang mendesak, lalu ajukan 3 pertanyaan kritis penguji kompetensi yang mengharuskan mereka menganalisis risiko, mengambil keputusan taktis, menunjuk dasar regulasi, dan memimpin tindakan perbaikan.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: ASSESSMENT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    res.json({ scenario: response.text });
  } catch (error: any) {
    console.error("Scenario generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate scenario." });
  }
});

// Routes delegate
app.post("/api/evaluate", evaluateHandler);

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

// Endpoint: AI Tutor Interactive chat API
app.post("/api/ai/tutor", async (req, res) => {
  try {
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

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Tutor chat error:", error);
    res.status(500).json({ error: error.message || "Failed to contact tutor agent." });
  }
});

// Setup dev and production static middleware
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`POPVirtual Server booted locally and running on http://localhost:${PORT}`);
  });
}

startServer();
