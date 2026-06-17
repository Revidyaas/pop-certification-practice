import { GoogleGenAI } from "@google/genai";

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

    return res.status(200).json({ scenario: response.text });
  } catch (error: any) {
    console.error("Scenario generation error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate scenario." });
  }
}
