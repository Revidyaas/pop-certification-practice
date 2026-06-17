import { useState, useEffect, useMemo } from "react";
import { examQuestions } from "../data";
import { ExamQuestion, ExamRecord } from "../types";
import { Award, Timer, CheckCircle2, XCircle, AlertTriangle, RefreshCw, BarChart2, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface SimulasiUjianProps {
  onSaveExam: (record: ExamRecord) => void;
}

export default function SimulasiUjian({ onSaveExam }: SimulasiUjianProps) {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selections, setSelections] = useState<{ [key: string]: number }>({});
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(1800); // 30 mins
  const [finalResult, setFinalResult] = useState<ExamRecord | null>(null);
  const [showKeyAnswers, setShowKeyAnswers] = useState<boolean>(false);

  // Initialize randomized set of questions upon launching the exam
  const startNewExam = () => {
    // Shuffle the pre-configured questions pool
    const shuffled = [...examQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setSelections({});
    setCurrentIdx(0);
    setSecondsLeft(1800); // 30 minutes
    setExamStarted(true);
    setExamFinished(false);
    setFinalResult(null);
    setShowKeyAnswers(false);
  };

  // Timer handle
  useEffect(() => {
    let interval: any = null;
    if (examStarted && !examFinished && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && examStarted && !examFinished) {
      // Force finish upon timeout!
      finishExam();
    }
    return () => clearInterval(interval);
  }, [examStarted, examFinished, secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (questionId: string, idx: number) => {
    setSelections((prev) => ({
      ...prev,
      [questionId]: idx,
    }));
  };

  const finishExam = () => {
    setExamFinished(true);
    
    // Grading calculation
    let correctCount = 0;
    const gradingResponses = questions.map((q) => {
      const selected = selections[q.id];
      const selectedOption = selected !== undefined ? selected : -1;
      const isCorrect = selectedOption === q.answerIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        questionText: q.question,
        selectedOption,
        correctOption: q.answerIndex,
        isCorrect,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    
    let competencyLevel = "Belum Kompeten";
    if (score >= 90) competencyLevel = "Sangat Kompeten";
    else if (score >= 75) competencyLevel = "Kompeten";
    else if (score >= 60) competencyLevel = "Cukup Kompeten";

    const record: ExamRecord = {
      examId: `exam-${Date.now()}`,
      userId: "local-user",
      score,
      competencyLevel,
      responses: gradingResponses,
      createdAt: new Date().toISOString(),
    };

    setFinalResult(record);
    onSaveExam(record);
  };

  // Calculate dynamic recommendations based on wrong modules
  const recommendations = useMemo(() => {
    if (!finalResult) return [];
    
    // Create maps of wrong answers topics
    const wrongCategories = new Set<string>();
    finalResult.responses.forEach((resp) => {
      if (!resp.isCorrect) {
        // Find module source category
        const origQ = examQuestions.find((eq) => eq.id === resp.questionId);
        if (origQ) wrongCategories.add(origQ.module);
      }
    });

    return Array.from(wrongCategories);
  }, [finalResult]);

  return (
    <div id="simulasi-ujian-tab" className="space-y-8 font-sans">
      
      {/* Intro landing page */}
      {!examStarted && (
        <div className="max-w-2xl mx-auto text-center space-y-6 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm mt-4">
          <div className="h-16 w-16 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center shadow-md">
            <Timer className="h-8 w-8 text-amber-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight uppercase">Simulasi Ujian Tertulis POP</h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Uji pengetahuan teori, undang-undang pertambangan, dan implementasi K3 Anda melalui simulasi ujian dengan batas waktu resmi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="p-3 text-center bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">JUMLAH SOAL</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">20 Soal Pilihan Ganda</div>
            </div>
            <div className="p-3 text-center bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">WAKTU UJIAN</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">30 Menit</div>
            </div>
            <div className="p-3 text-center bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">AMBANG KELULUSAN</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">75% (Kompeten)</div>
            </div>
          </div>

          <button
            onClick={startNewExam}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all shadow hover:text-amber-400 uppercase tracking-widest"
          >
            Mulai Ujian Sekarang
          </button>
        </div>
      )}

      {/* Active Exam Canvas */}
      {examStarted && !examFinished && questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: active question */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[420px]">
            <div>
              {/* Question header progress */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-4">
                <span className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">
                  SOAL {currentIdx + 1} DARI {questions.length}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                  {questions[currentIdx].module}
                </span>
              </div>

              {/* Question text */}
              <div className="mt-4">
                <h3 className="font-extrabold text-slate-900 text-sm leading-relaxed font-sans select-none">
                  {questions[currentIdx].question}
                </h3>
              </div>

              {/* Options lists */}
              <div className="mt-6 space-y-3">
                {questions[currentIdx].options.map((opt, oIdx) => {
                  const letter = ["A", "B", "C", "D"][oIdx];
                  const qId = questions[currentIdx].id;
                  const isSelected = selections[qId] === oIdx;

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(qId, oIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs leading-relaxed flex gap-4 transition-all ${
                        isSelected
                          ? "bg-slate-900 border-slate-950 text-white shadow"
                          : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50 text-slate-800"
                      }`}
                    >
                      <span className={`h-6 w-6 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                        isSelected ? "bg-slate-800 text-amber-400" : "bg-slate-100 text-slate-500"
                      }`}>
                        {letter}
                      </span>
                      <span className="font-sans inline-block cursor-pointer">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6 md:mt-12">
              <button
                onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Kembali
              </button>

              <button
                onClick={() => {
                  if (currentIdx === questions.length - 1) {
                    if (confirm("Sudah yakin dengan semua jawaban Anda dan ingin merampungkan ujian?")) {
                      finishExam();
                    }
                  } else {
                    setCurrentIdx((p) => p + 1);
                  }
                }}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider"
              >
                {currentIdx === questions.length - 1 ? "Selesai & Grade" : "Selanjutnya"}
                {currentIdx < questions.length - 1 && <ChevronRight className="h-4 w-4 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Right panel: timer & navigation grid */}
          <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Countdown panel */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Timer className="h-5 w-5 text-amber-500" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">SISA WAKTU</div>
                    <div className="text-xl font-black font-mono text-white tracking-widest">{formatTime(secondsLeft)}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Ingin membatalkan sesi ujian berjalan saat ini?")) {
                      setExamStarted(false);
                      setExamFinished(false);
                    }
                  }}
                  className="text-[10px] text-slate-400 hover:text-amber-400 hover:underline uppercase tracking-wide font-bold"
                >
                  Batal
                </button>
              </div>

              {/* Questions locator grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Lembar Navigasi Soal:</h4>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = selections[q.id] !== undefined;
                    const isActive = idx === currentIdx;

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-9 w-full rounded-lg text-xs font-bold border font-mono transition-all flex items-center justify-center ${
                          isActive
                            ? "bg-amber-500 border-amber-600 text-slate-950 scale-[1.05] shadow"
                            : isAnswered
                            ? "bg-slate-800 border-slate-700 text-slate-200"
                            : "bg-transparent border-slate-800 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick stats details summary hiterately */}
            <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-800/80 text-[10px] text-slate-400 space-y-1.5 font-mono">
              <div>• Klik nomor untuk melompat langsung ke soal.</div>
              <div>• Soal terjawab otomatis tersimpan hiterately.</div>
              <div>• Kelulusan minimal mendapatkan 15 benar (75%).</div>
            </div>
          </div>

        </div>
      )}

      {/* Exam Result summary display */}
      {examFinished && finalResult && (
        <div id="exam-result-sheet" className="max-w-3xl mx-auto space-y-8 animate-fade-in mt-4">
          
          {/* Card Score Header */}
          <div className="bg-slate-900 border border-slate-950 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden text-center space-y-5">
            <div className="absolute right-0 top-0 bottom-0 opacity-10">
              <svg className="h-full w-auto text-amber-500" viewBox="0 0 100 100" fill="currentColor">
                <polygon points="50,0 100,100 0,100" />
              </svg>
            </div>

            <div className="space-y-2">
              <div className="h-14 w-14 rounded-full bg-slate-800 border border-slate-700 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
                <Award className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold font-sans uppercase font-display tracking-tight">Hasil Simulasi Ujian POP</h2>
              <p className="text-slate-400 text-xs text-center">Evaluasi skor perundangan dan dasar teknik fungsional.</p>
            </div>

            <div className="flex flex-col sm:flex-row shadow border border-slate-850/80 bg-slate-950 rounded-2xl max-w-md mx-auto divide-y sm:divide-y-0 sm:divide-x divide-slate-800 overflow-hidden relative z-10">
              <div className="flex-1 p-4">
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">SKOR AKHIR</div>
                <div className="text-3xl font-black font-mono text-white mt-1">{finalResult.score}/100</div>
              </div>
              <div className="flex-1 p-4">
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">STATUS KELULUSAN</div>
                <div className="text-sm font-black text-amber-400 mt-2.5 uppercase tracking-wider">
                  {finalResult.score >= 75 ? "KOMPETEN ✓" : "BELUM LULUS (BK)"}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Anda menjawab dengan benar sebanyak <strong>{Math.round(finalResult.score / 5)} dari 20</strong> soal materi kurikulum POP.
            </p>

            <div className="flex items-center justify-center gap-3 relative z-10 pt-2">
              <button
                onClick={startNewExam}
                className="px-5 py-2.5 bg-amber-500 text-slate-900 hover:bg-amber-400 rounded-xl text-xs font-black shadow transition uppercase tracking-wider flex items-center gap-1.5"
              >
                <RefreshCw className="h-4 w-4 text-slate-900 animate-spin-slow" />
                Ulangi Ujian
              </button>
              <button
                onClick={() => setShowKeyAnswers((v) => !v)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700/60 rounded-xl text-xs font-bold transition uppercase tracking-wider"
              >
                {showKeyAnswers ? "Tutup Kunci Jawaban" : "Review Kunci Jawaban"}
              </button>
            </div>
          </div>

          {/* Dynamic Recommendations based on incorrect categories in test */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-widest border-b border-slate-50 pb-3">
              <BarChart2 className="h-5 w-5 text-slate-600" />
              Rekomendasi Area Belajar Anda
            </h3>
            
            {recommendations.length > 0 ? (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Berdasarkan jawaban salah, Anda direkomendasikan untuk meninjau kembali modul materi berikut demi mendongkrak skor kompetensi:
                </p>
                <div className="flex flex-wrap gap-2">
                  {recommendations.map((rec, idx) => (
                    <span
                      key={idx}
                      className="bg-red-50 text-red-800 border border-red-100 rounded-xl text-xs px-3 py-1.5 font-bold flex items-center gap-1.5"
                    >
                      <BookOpen className="h-4 w-4 text-red-600 font-bold" />
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-4 border border-emerald-100 rounded-2xl leading-relaxed font-sans font-semibold flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                Sempurna! Anda berhasil menguasai seluruh aspek modul teori ujian tulis sertifikasi POP dengan hasil 100%. Teruskan kompetensi leadership Anda di lapangan sesungguhnya!
              </p>
            )}
          </div>

          {/* Key Answers Review lists */}
          {showKeyAnswers && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 font-display">
                Lembar Review Kunci Jawaban & Penjelasan
              </h3>

              <div className="divide-y divide-slate-100 space-y-6">
                {questions.map((q, qIdx) => {
                  const resp = finalResult.responses.find((r) => r.questionId === q.id);
                  const isCorrect = resp ? resp.isCorrect : false;
                  
                  return (
                    <div key={q.id} className="pt-6 first:pt-0 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-extrabold text-slate-900 text-sm leading-relaxed font-sans">
                          {qIdx + 1}. {q.question}
                        </h4>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}>
                          {isCorrect ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {isCorrect ? "Benar" : "Salah"}
                        </span>
                      </div>

                      {/* Display options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isSelection = selections[q.id] === oIdx;
                          const isAnswer = q.answerIndex === oIdx;
                          return (
                            <div
                              key={oIdx}
                              className={`p-3 rounded-xl border leading-relaxed ${
                                isAnswer
                                  ? "bg-emerald-50/60 border-emerald-250 text-emerald-950 font-medium"
                                  : isSelection
                                  ? "bg-red-50/60 border-red-250 text-red-950"
                                  : "bg-slate-50 border-slate-100 text-slate-500"
                              }`}
                            >
                              <span className="font-mono font-bold uppercase shrink-0 mr-1.5">
                                {["A", "B", "C", "D"][oIdx]}.
                              </span>
                              {opt}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs">
                        <p className="font-bold text-slate-950 mb-1 font-mono text-[10px] uppercase tracking-wide">PEMBAHASAN HUKUM / TEORI POP:</p>
                        <p className="text-slate-600 leading-relaxed font-sans">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
