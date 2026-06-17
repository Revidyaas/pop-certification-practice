import { useState, useMemo } from "react";
import { UserProfile, AssessmentRecord, ExamRecord } from "../types";
import { popModules } from "../data";
import { Award, BookOpen, Clock, ShieldAlert, Sparkles, User, Brain, TrendingUp, CheckCircle2 } from "lucide-react";

interface DashboardProps {
  user: UserProfile;
  assessments: AssessmentRecord[];
  exams: ExamRecord[];
  completedModules: { [key: string]: boolean };
  onSelectTab: (tab: string) => void;
  onSelectModule: (moduleId: string) => void;
}

export default function Dashboard({
  user,
  assessments,
  exams,
  completedModules,
  onSelectTab,
  onSelectModule,
}: DashboardProps) {
  // Compute key statistics
  const completedCount = useMemo(() => {
    return Object.values(completedModules).filter(Boolean).length;
  }, [completedModules]);

  const percentage = useMemo(() => {
    return Math.round((completedCount / popModules.length) * 100);
  }, [completedCount]);

  const lastExamScore = useMemo(() => {
    if (exams.length === 0) return null;
    const sorted = [...exams].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted[0];
  }, [exams]);

  const lastAssessment = useMemo(() => {
    if (assessments.length === 0) return null;
    const sorted = [...assessments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted[0];
  }, [assessments]);

  // Aggregate competency scores based on previous AI Assessor evaluations
  const competencies = useMemo(() => {
    const scores = {
      keselamatan: 0,
      regulasi: 0,
      keputusan: 0,
      risiko: 0,
      kepemimpinan: 0,
      komunikasi: 0,
    };

    if (assessments.length > 0) {
      const completedAssess = assessments.filter(a => a.status === "completed" && a.rubricScores);
      if (completedAssess.length > 0) {
        let kes = 0, reg = 0, kep = 0, ris = 0, lead = 0, com = 0;
        completedAssess.forEach(a => {
          if (a.rubricScores) {
            kes += a.rubricScores.keselamatan || 0;
            reg += a.rubricScores.regulasi || 0;
            kep += a.rubricScores.keputusan || 0;
            ris += a.rubricScores.risiko || 0;
            lead += a.rubricScores.kepemimpinan || 0;
            com += a.rubricScores.komunikasi || 0;
          }
        });
        const len = completedAssess.length;
        scores.keselamatan = Math.round(kes / len);
        scores.regulasi = Math.round(reg / len);
        scores.keputusan = Math.round(kep / len);
        scores.risiko = Math.round(ris / len);
        scores.kepemimpinan = Math.round(lead / len);
        scores.komunikasi = Math.round(com / len);
      }
    }
    return scores;
  }, [assessments]);

  // SVG Radar Chart coordinates calculation
  const radarPoints = useMemo(() => {
    const center = 150;
    const radius = 100;
    const labels = ["Keselamatan", "Regulasi", "Keputusan", "Risiko", "Kepemimpinan", "Komunikasi"];
    
    const values = [
      competencies.keselamatan,
      competencies.regulasi,
      competencies.keputusan,
      competencies.risiko,
      competencies.kepemimpinan,
      competencies.komunikasi,
    ];

    const points = values.map((val, i) => {
      const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
      const amount = (val / 100) * radius;
      const x = center + amount * Math.cos(angle);
      const y = center + amount * Math.sin(angle);
      return { x, y, label: labels[i], value: val, angle };
    });

    return points;
  }, [competencies]);

  // Generate background hexagonal rings for Radar Chart
  const radarWebs = [20, 40, 60, 80, 100].map((level) => {
    const center = 150;
    const radius = 100;
    const amount = (level / 100) * radius;
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
      const x = center + amount * Math.cos(angle);
      const y = center + amount * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  });

  const overallCompetencyLevel = useMemo(() => {
    if (assessments.length === 0) {
      return { label: "Belum Teruji", bg: "bg-slate-100 text-slate-600 border-slate-200", text: "text-slate-500" };
    }
    const vals = Object.values(competencies) as number[];
    const average = vals.reduce((a, b) => a + b, 0) / 6;
    if (average < 60) return { label: "Belum Kompeten", bg: "bg-red-50 text-red-700 border-red-200", text: "text-red-600" };
    if (average < 75) return { label: "Cukup Kompeten", bg: "bg-amber-50 text-amber-700 border-amber-200", text: "text-amber-600" };
    if (average < 90) return { label: "Kompeten", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-600" };
    return { label: "Sangat Kompeten", bg: "bg-cyan-50 text-cyan-700 border-cyan-200", text: "text-cyan-600" };
  }, [competencies, assessments]);

  const strategicRecommendation = useMemo(() => {
    if (assessments.length === 0) {
      return (
        <span>
          <strong>Rekomendasi Awal:</strong> Mulai perjalanan bimbingan Anda! Buka tab <strong>Learning Modules</strong> untuk mempelajari unit kompetensi pertambangan atau jalankan simulasi lisan di <strong>AI Assessor Mode</strong>.
        </span>
      );
    }
    
    const entries = Object.entries(competencies) as [string, number][];
    let lowestKey = entries[0][0];
    let lowestVal = entries[0][1];
    
    for (let i = 1; i < entries.length; i++) {
      if (entries[i][1] < lowestVal) {
        lowestKey = entries[i][0];
        lowestVal = entries[i][1];
      }
    }

    const labelsMap: { [key: string]: string } = {
      keselamatan: "Dasar Keselamatan (K3 Tambang)",
      regulasi: "SMKP & Perundangan Tambang",
      keputusan: "Pengambilan Keputusan Lapangan",
      risiko: "Manajemen Risiko (JSA/IBPR)",
      kepemimpinan: "Kepemimpinan & Toolbox Meeting",
      komunikasi: "Komunikasi Keselamatan Kerja",
    };

    const labelName = labelsMap[lowestKey] || lowestKey;

    if (lowestVal >= 80) {
      return (
        <span>
          <strong>Selamat!</strong> Seluruh profil kompetensi pertambangan Anda telah melampaui 80%. Pertahankan fokus operasional yang tinggi dan ikuti simulasi ujian MCQ tertulis di menu Simulasi Ujian!
        </span>
      );
    }

    return (
      <span>
        <strong>Rekomendasi Strategis POP:</strong> Aspek pemahaman terlemah terdeteksi pada <strong>{labelName} ({lowestVal}%)</strong>. Lakukan bimbingan intensif tambahan untuk menyempurnakan kesiapan Anda sebelum ujian.
      </span>
    );
  }, [competencies, assessments]);

  return (
    <div id="dashboard-tab" className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div id="welcome-banner" className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 bottom-0 top-0 opacity-15">
          <svg className="h-full w-auto text-amber-500/10" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" />
          </svg>
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-500 font-semibold tracking-wide uppercase text-xs">
              <Sparkles className="h-4 w-4" />
              <span>POP AI-Expert Prep System</span>
            </div>
            <h1 id="user-greeting" className="text-3xl font-bold font-display tracking-tight text-white">
              Welcome Back, {user.name}!
            </h1>
            <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
              Ini adalah asisten virtual interaktif Anda untuk mempersiapkan Sertifikasi <strong className="text-amber-400">Pengawas Operasional Pertama (POP)</strong> Pertambangan Indonesia. Uji kemampuan taktis dan penalaran lapangan Anda sekarang.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 self-start md:self-center">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border shadow ${overallCompetencyLevel.bg}`}>
              <Award className="h-4 w-4 text-amber-500" />
              {overallCompetencyLevel.label}
            </span>
            <div className="text-xs text-slate-400 font-mono">
              Role: <span className="text-amber-500 uppercase font-bold">{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div id="stats-grid" className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4 hover:border-amber-500/30 hover:shadow-md transition">
          <div className="rounded-lg bg-slate-900 p-3 text-amber-500">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Course Progress</div>
            <div className="text-xl font-bold text-slate-900">{completedCount} of 8 Modul</div>
            <div className="mt-1.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4 hover:border-amber-500/30 hover:shadow-md transition">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Simulation Score</div>
            <div className="text-xl font-bold text-slate-900">
              {lastExamScore ? `${lastExamScore.score}%` : "0%"}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {lastExamScore ? lastExamScore.competencyLevel : "Ujian MCQ 20 Soal"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4 hover:border-amber-500/30 hover:shadow-md transition">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-500">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Risk Ident. Score</div>
            <div className="text-xl font-bold text-slate-900">
              {competencies.risiko > 0 ? `${competencies.risiko} / 100` : "-"}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Evaluated Competency</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4 hover:border-amber-500/30 hover:shadow-md transition">
          <div className="rounded-lg bg-slate-100 p-3 text-slate-700">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Exams Taken</div>
            <div className="text-lg font-bold text-slate-900">{exams.length} Sesi</div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">MCQ Simulations Completed</p>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Competency Analysis */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 tracking-wide uppercase">
              <span className="text-lg">🎯</span>
              Core Competencies Radar
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Diperoleh dari evaluasi kumulatif interaksi asesmen K3 & KO lapangan Anda.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 justify-center my-6">
            {/* Visual Radarchart using static SVG */}
            <div className="relative w-[280px] h-[280px] shrink-0">
              <svg className="w-full h-full transform [-webkit-transform:rotate(30deg)] [transform:rotate(30deg)]" viewBox="0 0 300 300">
                {/* Webs backdrop */}
                {radarWebs.map((points, idx) => (
                  <polygon
                    key={idx}
                    points={points}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="0.75"
                  />
                ))}

                {/* Axes and text labels */}
                {radarPoints.map((pt, idx) => {
                  const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2;
                  const endX = 150 + 100 * Math.cos(angle);
                  const endY = 150 + 100 * Math.sin(angle);
                  
                  // offset text coordinate slightly outside
                  const labelRadius = 120;
                  const labelX = 150 + labelRadius * Math.cos(angle);
                  const labelY = 150 + labelRadius * Math.sin(angle);
                  
                  return (
                    <g key={idx}>
                      <line x1="150" y1="150" x2={endX} y2={endY} stroke="#e2e8f0" strokeWidth="0.5" />
                      <text
                        x={labelX}
                        y={labelY}
                        fontSize="9"
                        fill="#64748b"
                        fontWeight="700"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        className="transform rotate-[-30deg] origin-center"
                      >
                        {pt.label.toUpperCase()}
                      </text>
                      <text
                        x={labelX}
                        y={labelY + 11}
                        fontSize="9"
                        fill="#0f172a"
                        fontWeight="850"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        className="transform rotate-[-30deg] origin-center"
                      >
                        {pt.value}%
                      </text>
                    </g>
                  );
                })}

                {/* Draw values polygon */}
                <polygon
                  points={radarPoints.map(p => `${p.x},${p.y}`).join(" ")}
                  fill="rgba(245, 158, 11, 0.2)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />

                {/* Points coordinates */}
                {radarPoints.map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                ))}
              </svg>
            </div>

            {/* Micro details bar description */}
            <div className="flex-1 space-y-4 w-full">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>SAFETY & ENVIRONMENT</span>
                  <span className="text-slate-900 font-mono font-bold">{competencies.keselamatan}%</span>
                </div>
                <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${competencies.keselamatan}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>REGULATION & SMKP</span>
                  <span className="text-slate-900 font-mono font-bold">{competencies.regulasi}%</span>
                </div>
                <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${competencies.regulasi}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>RISK MANAGEMENT (JSA)</span>
                  <span className="text-slate-900 font-mono font-bold">{competencies.risiko}%</span>
                </div>
                <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${competencies.risiko}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>FIELD LEADERSHIP</span>
                  <span className="text-slate-900 font-mono font-bold">{competencies.kepemimpinan}%</span>
                </div>
                <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${competencies.kepemimpinan}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200/50 text-xs text-amber-900 leading-relaxed flex gap-2.5 items-start">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            {strategicRecommendation}
          </div>
        </div>

        {/* Right Side: Learning Path Flow */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 tracking-wide uppercase">
                <span className="text-lg">📘</span>
                Learning Modules Progress
              </h2>
              <p className="text-xs text-slate-500">
                Selesaikan kurikulum untuk menguasai materi asesmen formal ESDM.
              </p>
            </div>

            {/* Module lists showing toggled or untoggled state */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {popModules.map((mod, idx) => {
                const completed = completedModules[mod.id];
                return (
                  <div
                    key={mod.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                      completed
                        ? "bg-slate-50 border-slate-200/80"
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => onSelectModule(mod.id)}
                        className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold cursor-pointer transition ${
                          completed
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {completed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </div>
                      <div>
                        <div
                          onClick={() => onSelectModule(mod.id)}
                          className="text-xs font-bold text-slate-800 hover:text-amber-600 cursor-pointer transition"
                        >
                          {mod.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase">{mod.category}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectModule(mod.id)}
                      className="text-[10px] font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider"
                    >
                      Buka
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => onSelectTab("materi")}
              className="flex-1 text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition uppercase tracking-wider"
            >
              Study Modules
            </button>
            <button
              onClick={() => onSelectTab("simulasi")}
              className="flex-1 text-center py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition uppercase tracking-wider"
            >
              Simulasi Ujian
            </button>
          </div>
        </div>
      </div>

      {/* History panel */}
      {assessments.length > 0 && (
        <div id="assessment-history" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span>📋</span> Recent Assessment History
            </h3>
            <button onClick={() => onSelectTab("assessor")} className="text-xs font-bold text-blue-600 hover:underline">
              View Full Analytics
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-bold tracking-wider uppercase">
                  <th className="px-4 py-3">TOPIC</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">SCORE</th>
                  <th className="px-4 py-3">AI FEEDBACK</th>
                  <th className="px-4 py-3">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {assessments.slice(0, 5).map((a) => (
                  <tr key={a.assessmentId} className="hover:bg-slate-50 border-b border-slate-50">
                    <td className="px-4 py-3.5 font-bold text-slate-800">{a.moduleTitle}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                        a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {a.status === 'completed' ? 'KOMPETEN' : 'IN PROGRESS'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600">
                      {a.scoreTotal !== undefined ? `${a.scoreTotal}/100` : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate italic">
                      "{a.kelebihan || "Analisis taktis operasional sedang dievaluasi..."}"
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 font-mono">
                      {new Date(a.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
