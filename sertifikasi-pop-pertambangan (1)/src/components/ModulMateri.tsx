import { useState } from "react";
import { popModules } from "../data";
import { ModuleItem } from "../types";
import { BookOpen, AlertCircle, FileText, ArrowRight, ShieldAlert, CheckCircle, HelpCircle } from "lucide-react";

interface ModulMateriProps {
  completedModules: { [key: string]: boolean };
  onToggleComplete: (moduleId: string) => void;
  onLaunchTutor: (moduleId: string) => void;
  onLaunchAssessment: (moduleId: string) => void;
  selectedModuleId?: string | null;
}

export default function ModulMateri({
  completedModules,
  onToggleComplete,
  onLaunchTutor,
  onLaunchAssessment,
  selectedModuleId,
}: ModulMateriProps) {
  const [activeModuleId, setActiveModuleId] = useState<string>(selectedModuleId || popModules[0].id);

  const activeModule = popModules.find((m) => m.id === activeModuleId) || popModules[0];
  const isCompleted = completedModules[activeModule.id];

  return (
    <div id="materi-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Left Column: List of 8 modules */}
      <div className="lg:col-span-4 space-y-3">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1 mb-2">LEARNING MODULES CURRICULUM</h2>
        <div className="space-y-2.5">
          {popModules.map((mod) => {
            const completed = completedModules[mod.id];
            const isActive = mod.id === activeModuleId;
            return (
              <div
                key={mod.id}
                onClick={() => setActiveModuleId(mod.id)}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                  isActive
                    ? "bg-slate-950 border-slate-950 text-white shadow-xl scale-[1.01]"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm text-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isActive ? "bg-slate-800 text-amber-400" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {mod.category}
                  </span>
                  {completed && <span className="text-emerald-500 text-xs font-bold font-sans">✓ Selesai</span>}
                </div>
                <h3 className="font-bold text-sm mt-2">{mod.title}</h3>
                <p className={`text-xs leading-relaxed mt-1.5 ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                  {mod.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Detailed selected module view */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 font-display tracking-tight">{activeModule.title}</h1>
            <p className="text-slate-500 text-xs mt-0.5">Topik Modul: <strong className="text-slate-800">{activeModule.category}</strong></p>
          </div>
          <button
            onClick={() => onToggleComplete(activeModule.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              isCompleted
                ? "bg-green-100 text-green-800"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
            }`}
          >
            {isCompleted ? "✓ Ditandai Selesai" : "Tandai Modul Selesai"}
          </button>
        </div>

        {/* Ringkasan */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide mb-2">
            <BookOpen className="h-4 w-4 text-slate-600" />
            Ringkasan Inti
          </h3>
          <p className="text-slate-700 text-xs leading-relaxed font-sans">{activeModule.ringkasan}</p>
        </div>

        {/* Materi Detail */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-slate-600" />
            Pokok Pembahasan Esensial
          </h3>
          <ul className="grid grid-cols-1 gap-2.5">
            {activeModule.materiDetail.map((point, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-600 leading-relaxed border-l-2 border-slate-300 pl-3 py-0.5 font-sans"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Kurikulum Hukum / Regulasi */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-slate-600" />
            Acuan Regulasi Terkait
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeModule.keyRegulations.map((reg, idx) => (
              <span
                key={idx}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-mono px-2.5 py-1 rounded"
              >
                {reg}
              </span>
            ))}
          </div>
        </div>

        {/* Studi Kasus & Pertanyaan HOTS */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-900 text-[10px] uppercase font-mono font-black px-2 py-0.5 rounded">
              Studi Kasus Lapangan
            </span>
            <h4 className="font-bold text-sm text-slate-900">{activeModule.casestudy.title}</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans italic">
            "{activeModule.casestudy.description}"
          </p>
          <div className="bg-amber-50/70 rounded-lg p-3 border border-amber-200/50 text-xs">
            <p className="font-bold text-amber-900 flex items-center gap-1">
              <HelpCircle className="h-4 w-4 text-amber-700" />
              Pertanyaan Penguji Kompetensi (HOTS):
            </p>
            <p className="text-slate-700 mt-1 font-semibold leading-relaxed font-sans">
              {activeModule.casestudy.question}
            </p>
          </div>
        </div>

        {/* Bottom Interactive CAs */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => onLaunchTutor(activeModule.title)}
            className="flex-1 py-3 text-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition uppercase tracking-wider"
          >
            Tanya AI Tutor Modul Ini
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </button>
          <button
            onClick={() => onLaunchAssessment(activeModule.title)}
            className="flex-1 py-3 text-center bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition uppercase tracking-wider"
          >
            Asesmen Wawancara Dengan AI
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
