import { useState, useEffect } from "react";
import { AssessmentRecord, RubricScores } from "../types";
import { Sparkles, Play, Award, CheckCircle, AlertTriangle, HelpCircle, ShieldAlert, BookOpen, Send, UserCheck, ChevronRight } from "lucide-react";

interface AIAssessorProps {
  initialTopic?: string | null;
  onSaveAssessment: (record: AssessmentRecord) => void;
}

export default function AIAssessor({ initialTopic, onSaveAssessment }: AIAssessorProps) {
  const [topic, setTopic] = useState<string>("Investigasi Kecelakaan");
  const [scenario, setScenario] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [generatingScenario, setGeneratingScenario] = useState<boolean>(false);
  const [submittingAnswer, setSubmittingAnswer] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  // Pre-configured official POP cases
  const officialCases = [
    {
      title: "Target Produksi Tinggi vs Jalan Licin",
      topic: "Keselamatan Operasi & Cuaca",
      scenario: `Anda adalah Pengawas Operasional pada tambang terbuka. Saat inspeksi pagi hari ditemukan:
1. Jalan tambang sangat licin akibat hujan deras semalaman.
2. Target produksi batubara hari itu sangat tinggi karena kapal tongkang kargo di port harus segera dimuat pukul 16:00.
3. Supervisor produksi PT sub-kontraktor mendesak dan meminta operasi hauling tetap berjalan segera menggunakan kecepatan rendah.

Apa keputusan taktis dan strategis yang akan Anda ambil selaku Pengawas Operasional Tambang?
Sertakan risiko terburuk, dasar peraturan perundang-undangan (SMKP/Kepmen), dan tindakan penanganan komprehensif.`
    },
    {
      title: "Near Miss Tabrakan Alat Berat & LV",
      topic: "Investigasi Kecelakaan",
      scenario: `Terjadi insiden near miss (hampir tabrakan) yang sangat serius di simpang hauling roda gawang. 
Satu unit Dump Truck Komatsu HD785 yang bermuatan penuh tergelincir ketika berbelok, hampir melindas mobil Light Vehicle (LV) Mitsubishi Triton pengawas survey Geoteknik yang diparkir terlalu dekat dengan radius blindspot tikungan. Tidak ada cedera personel, tetapi bumper belakang LV ringsek terkena kikisan ban HD.

Sebagai Pengawas Operasional Pertama di lokasi kejadian:
1. Apa tindakan darurat awal yang wajib Anda laksanakan seketika di TKP?
2. Bagaimana prosedur investigasi formal yang akan Anda pimpin guna mengungkap akar masalah (root cause)?
3. Temukan tindakan korektif dan preventif struktural agar kejadian ini tidak terulang.`
    }
  ];

  // If a topic came from the Materi module, generate a custom case on it immediately
  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      handleGenerateScenario(initialTopic);
    } else {
      // Load standard first case by default
      setScenario(officialCases[0].scenario);
    }
  }, [initialTopic]);

  const handleGenerateScenario = async (selectedTopic: string) => {
    setGeneratingScenario(true);
    setEvaluation(null);
    setUserAnswer("");
    try {
      const res = await fetch("/api/ai/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: selectedTopic }),
      });
      if (!res.ok) throw new Error("Gagal mengambil skenario baru.");
      const data = await res.json();
      setScenario(data.scenario);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setGeneratingScenario(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert("Harap tuliskan tanggapan Anda terlebih dahulu.");
      return;
    }
    setSubmittingAnswer(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          answer: userAnswer
        }),
      });
      if (!res.ok) throw new Error("Penilaian gagal diproses oleh AI.");
      const data = await res.json();
      setEvaluation(data);

      // Trigger saving progress to overall state
      const record: AssessmentRecord = {
        assessmentId: `assess-${Date.now()}`,
        userId: "local-user",
        moduleTitle: topic,
        status: "completed",
        scenario,
        answers: [userAnswer],
        questions: ["Evaluasi Kompetensi"],
        rubricScores: data.rubricScores,
        scoreTotal: data.scoreTotal,
        level: data.level,
        kelebihan: data.kelebihan,
        kekurangan: data.kekurangan,
        perspektif: data.perspektif,
        contohIdeal: data.contohIdeal,
        createdAt: new Date().toISOString()
      };
      onSaveAssessment(record);
    } catch (e: any) {
      alert("Gagal menilai tanggapan: " + e.message);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const getCompetencyColor = (level: string) => {
    switch (level) {
      case "Sangat Kompeten": return "bg-cyan-500 text-white";
      case "Kompeten": return "bg-emerald-500 text-white";
      case "Cukup Kompeten": return "bg-amber-500 text-black";
      default: return "bg-red-500 text-white";
    }
  };

  return (
    <div id="ai-assessor-tab" className="space-y-8 font-sans">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 font-display tracking-tight uppercase">
            <UserCheck className="h-6 w-6 text-slate-800" />
            AI Assessor Sertifikasi POP
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Uji kemampuan analisis operasional Anda langsung dengan asisten asesor berpengalaman 20 tahun pertambangan.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-white border border-slate-200 text-xs px-3.5 py-2 rounded-xl outline-none cursor-pointer focus:border-slate-500 hover:bg-slate-50 transition"
          >
            <option value="Dasar Keselamatan Pertambangan">Dasar K3</option>
            <option value="Sistem Manajemen (SMKP)">SMKP Minerba</option>
            <option value="Manajemen Risiko IBPR">Manajemen Risiko</option>
            <option value="Investigasi Kecelakaan">Investigasi</option>
            <option value="Kepemimpinan Pengawas">Kepemimpinan</option>
            <option value="Pengelolaan Lingkungan Hidup">Lingkungan</option>
            <option value="Tanggap Darurat Tambang">Kondisi Darurat</option>
          </select>
          <button
            onClick={() => handleGenerateScenario(topic)}
            disabled={generatingScenario}
            className="bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm hover:text-amber-400 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            {generatingScenario ? "Sedang Menyusun..." : "Buat Kasus Baru"}
          </button>
        </div>
      </div>

      {/* Official Case templates quick selection */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-mono font-black text-slate-400 tracking-wider">Pilih Kasus Cepat</span>
          <p className="text-xs font-semibold text-slate-700">Dua kasus tersering dalam simulasi wawancara penguji nasional:</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {officialCases.map((cs, idx) => (
            <button
              key={idx}
              onClick={() => {
                setScenario(cs.scenario);
                setTopic(cs.topic);
                setEvaluation(null);
                setUserAnswer("");
              }}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium transition text-slate-800"
            >
              {cs.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left pane: Scenario and Answer box */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Skenario Ujian Lapangan (HOTS)
            </h3>
            
            {generatingScenario ? (
              <div className="h-32 flex flex-col items-center justify-center space-y-2">
                <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-mono animate-pulse">Menghubungi Tim Asesor Nasional...</p>
              </div>
            ) : (
              <div className="text-slate-800 text-xs leading-relaxed font-sans whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                "{scenario}"
              </div>
            )}

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-900 block font-sans">Tanggapan & Solusi Pengawas (Tuliskan Di Sini):</label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={submittingAnswer || generatingScenario}
                rows={8}
                placeholder="Petunjuk: Jelaskan tindakan penghentian operasi pertama, cara lokalisasi bahaya, komunikasi dengan kru harian, delegasi alat tambang, serta pasal hukum KTT yang Anda pakai untuk menolak tekanan produksi..."
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:bg-white p-4 rounded-xl text-xs outline-none transition-all resize-y font-sans h-[220px]"
              />
            </div>

            <div className="text-[11px] text-amber-900 leading-relaxed bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/50 flex gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Instruksi Rubrik:</strong> Tuliskan tindakan komprehensif, logis, dan prioritaskan keselamatan tim. Jawaban yang pendek, menyalahkan rekan lain, atau mengorbankan K3 demi mengejar target akan mendapatkan status "Belum Kompeten" secara langsung.
              </span>
            </div>

            <button
              onClick={handleSubmitAnswer}
              disabled={submittingAnswer || !userAnswer.trim() || generatingScenario}
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow disabled:opacity-45 uppercase tracking-wider"
            >
              <Send className="h-4 w-4 text-amber-400" />
              {submittingAnswer ? "Asesor sedang memeriksa..." : "Submit Jawaban ke Assessor"}
            </button>
          </div>
        </div>

        {/* Right pane: Grade & feedback display */}
        <div className="space-y-6">
          {submittingAnswer ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center space-y-4 min-h-[400px]">
              <div className="h-10 w-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center space-y-2">
                <h4 className="font-bold text-sm text-slate-900 leading-relaxed font-sans">Kalkulasi Skor Kompetensi</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-mono animate-pulse">
                  Asesor sedang me-review jawaban Anda terhadap parameter: K3, Regulasi Kepmen, IBPR, Leadership, KO & Komunikasi...
                </p>
              </div>
            </div>
          ) : evaluation ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
              
              {/* Header result */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">HASIL ASESMEN AI</div>
                  <h3 className="text-base font-black text-slate-950 mt-1 uppercase font-display tracking-tight">Ulasan Evaluasi Kompetensi</h3>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div className="text-3xl font-mono font-extrabold text-slate-900">{evaluation.scoreTotal}</div>
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCompetencyColor(evaluation.level)}`}>
                    {evaluation.level}
                  </span>
                </div>
              </div>

              {/* Rubric scores meters */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Detail Rubrik Penilaian</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                  
                  {/* Keselamatan */}
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">1. Keselamatan Kerja</span>
                      <span className="font-bold font-mono text-slate-900">{evaluation.rubricScores.keselamatan}%</span>
                    </div>
                    <div className="mt-1 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-900 h-full" style={{ width: `${evaluation.rubricScores.keselamatan}%` }}></div>
                    </div>
                  </div>

                  {/* Regulasi */}
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">2. Regulasi (Kepmen)</span>
                      <span className="font-bold font-mono text-slate-900">{evaluation.rubricScores.regulasi}%</span>
                    </div>
                    <div className="mt-1 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-900 h-full" style={{ width: `${evaluation.rubricScores.regulasi}%` }}></div>
                    </div>
                  </div>

                  {/* Identifikasi Risiko */}
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">3. Manajemen Risiko</span>
                      <span className="font-bold font-mono text-slate-900">{evaluation.rubricScores.risiko}%</span>
                    </div>
                    <div className="mt-1 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-900 h-full" style={{ width: `${evaluation.rubricScores.risiko}%` }}></div>
                    </div>
                  </div>

                  {/* Pengambilan Keputusan */}
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">4. Pengambilan Keputusan</span>
                      <span className="font-bold font-mono text-slate-900">{evaluation.rubricScores.keputusan}%</span>
                    </div>
                    <div className="mt-1 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-900 h-full" style={{ width: `${evaluation.rubricScores.keputusan}%` }}></div>
                    </div>
                  </div>

                  {/* Kepemimpinan */}
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">5. Leadership/Kepemimpinan</span>
                      <span className="font-bold font-mono text-slate-900">{evaluation.rubricScores.kepemimpinan}%</span>
                    </div>
                    <div className="mt-1 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-900 h-full" style={{ width: `${evaluation.rubricScores.kepemimpinan}%` }}></div>
                    </div>
                  </div>

                  {/* Komunikasi */}
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">6. Komunikasi & Instruksi</span>
                      <span className="font-bold font-mono text-slate-900">{evaluation.rubricScores.komunikasi}%</span>
                    </div>
                    <div className="mt-1 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-900 h-full" style={{ width: `${evaluation.rubricScores.komunikasi}%` }}></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Feedbacks bullet list */}
              <div className="space-y-4 pt-2 border-t border-slate-150">
                
                {/* Kelebihan */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-flex items-center gap-1 font-mono uppercase tracking-wider">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    Kelebihan Jawaban:
                  </h5>
                  <ul className="list-disc pl-5 text-xs text-slate-600 leading-relaxed space-y-1 font-sans">
                    {evaluation.kelebihan.map((g: string, idx: number) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>

                {/* Kekurangan */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded inline-flex items-center gap-1 font-mono uppercase tracking-wider">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    Kekurangan Jawaban (Gap):
                  </h5>
                  <ul className="list-disc pl-5 text-xs text-slate-600 leading-relaxed space-y-1 font-sans">
                    {evaluation.kekurangan.map((b: string, idx: number) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* Perspektif */}
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                  <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1 uppercase tracking-wider font-mono">
                    <BookOpen className="h-4 w-4 text-slate-600" />
                    Aspek Pandang Asesor Senior:
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{evaluation.perspektif}</p>
                </div>

                {/* Ideal answer draft */}
                <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1 uppercase tracking-wider font-mono">
                    <Award className="h-4 w-4 text-emerald-700" />
                    Rujukan Jawaban Ideal Kompeten:
                  </h5>
                  <p className="text-xs text-emerald-900 leading-relaxed whitespace-pre-wrap font-sans bg-white/70 p-3 rounded-lg border border-emerald-50 font-medium">
                    {evaluation.contohIdeal}
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px] h-full space-y-3">
              <div className="h-12 w-12 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-400">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-800 font-sans uppercase tracking-wider">Belum Ada Jawaban yang Dinilai</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-sans">
                  Selesaikan skenario di layar kiri, ketikkan tanggapan Anda lengkap, dan luncurkan evaluasi. Hasil rubrik akan terisi otomatis di panel ini.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
