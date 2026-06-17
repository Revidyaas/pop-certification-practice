import { useState } from "react";
import { 
  Sparkles, 
  LogIn, 
  Loader2, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  BrainCircuit
} from "lucide-react";

interface LoginProps {
  onLogin: () => Promise<void>;
  loading: boolean;
}

export default function Login({ onLogin, loading }: LoginProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    try {
      await onLogin();
    } catch (err: any) {
      setError(err?.message || "Gagal masuk menggunakan Google. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Abstract Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Container */}
      <div className="max-w-md mx-auto w-full text-center relative z-10">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-amber-500/20">
            <span>P</span>
          </div>
          <div className="text-left">
            <span className="font-display font-bold text-xl text-white block tracking-wider uppercase">
              POP AI-EXPERT
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-normal block">
              Certify with Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 my-auto">
        
        {/* Left Grid: Features Guide Info */}
        <div className="md:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-500 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sistem Pendidikan Mandiri POP</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Persiapan Ujian Evaluasi Kompetensi <span className="text-amber-500 block sm:inline">Pengawas Operasional Pertama</span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Sistem simulasi, pembelajaran terstruktur, dan bimbingan interaktif bertenaga AI untuk mematangkan pemahaman regulasi K3 tambang, SMKP Minerba, dan kepemimpinan operasional Anda.
          </p>

          {/* Grid benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800/60">
              <BookOpen className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">8 Modul Kurikulum</h4>
                <p className="text-[11px] text-slate-400 mt-1">Menguasai esensi regulas, JSA, investigasi insiden, dan pengelolaan lingkungan murni ESDM Kepmen 1827.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800/60">
              <BrainCircuit className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Assessor Mode</h4>
                <p className="text-[11px] text-slate-400 mt-1">Menguji penalaran taktis dalam skenario HOTS tambang dengan evaluasi rubrik formal secara real-time.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800/60">
              <Award className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Simulasi MCQ Teruji</h4>
                <p className="text-[11px] text-slate-400 mt-1">Latihan pilihan ganda komprehensif terstandar KTT dengan penjelasan rinci pasca-tes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800/60">
              <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Durable Cloud Sync</h4>
                <p className="text-[11px] text-slate-400 mt-1">Seluruh record hasil asesmen, statistik, dan progress terekam aman menggunakan Google Cloud Firebase.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Grid: Login Box */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <div className="space-y-4 text-center">
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Pintu Masuk Peserta</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hubungkan akun Google Anda untuk memulai simulasi terakreditasi dan mensinkronisasikan hasil bimbingan.
            </p>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-400 leading-relaxed font-medium">
                {error}
              </div>
            )}

            <div className="pt-4">
              {loading ? (
                <div className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-850 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase font-mono shadow">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  <span>Autentikasi Sesi...</span>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/10 font-sans transition-all active:scale-95 duration-150"
                >
                  <LogIn className="h-4 w-4 shrink-0" />
                  <span>Masuk dengan Google</span>
                </button>
              )}
            </div>

            <div className="text-[10px] text-zinc-500 leading-normal pt-4 border-t border-slate-800/50 font-mono">
              Otentikasi aman via Google Firebase Services.<br />
              Data terenkripsi hiterately.
            </div>
          </div>
        </div>

      </div>

      {/* Footer Container */}
      <div className="max-w-md mx-auto w-full text-center relative z-10 pt-8 border-t border-slate-900/50">
        <p className="text-[10px] text-slate-500 font-mono">
          © 2026 POPVirtual Minerba. All Rights Reserved.
        </p>
      </div>

    </div>
  );
}
