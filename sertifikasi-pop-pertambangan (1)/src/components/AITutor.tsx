import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Sparkles, BookOpen, User, RotateCcw, AlertCircle, HelpCircle } from "lucide-react";

interface AITutorProps {
  initialTopic?: string | null;
}

export default function AITutor({ initialTopic }: AITutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-tutor",
      role: "assistant",
      content: `Halo rekan pengawas! Saya adalah **Mentor Pembelajaran POP** Anda. \n\nSaya siap membantu Anda memahami 8 kompetensi utama pengawas pertambangan harian (seperti JSA, investigasi kecelakaan, pemahaman SMKP Minerba, dan inspeksi K3). \n\nAda materi khusus atau istilah regulasi pertambangan yang ingin kita diskusikan menggunakan analogi praktis? Silakan tanyakan kepada saya!`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Trigger inquiry based on module clicked in Materi Tab
  useEffect(() => {
    if (initialTopic) {
      handleSendPrompt(`Tolong jelaskan secara mendalam mengenai modul "${initialTopic}". Berikan contoh studi kasus harian dan dasar regulasi mineral teknisnya.`);
    }
  }, [initialTopic]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Map history to server payloads
      const serverHistory = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content
      }));

      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: serverHistory,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal terhubung dengan server AI.");
      }

      const data = await res.json();
      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Maaf rekan, kelihatannya respon mengalami gangguan.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ Hubungan terputus: ${e.message || "Gagal menghubungi AI Engine. Harap periksa koneksi."}`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Ingin menghapus riwayat diskusi pembelajaran saat ini?")) {
      setMessages([
        {
          id: "welcome-tutor-restart",
          role: "assistant",
          content: `Silakan, riwayat diskusi telah direset. Ada bahasan baru seputar keselamatan atau regulasi pertambangan yang ingin Anda ulas hiterately?`,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const quickQuestions = [
    "Bagaimana hierarki kontrol risiko di terapkan di Disposal area?",
    "Jelaskan beda K3 Pertambangan dengan Keselamatan Operasi (KO)!",
    "Apa langkah awal investigasi kecelakaan jika ada near miss serius?",
    "Sebutkan 7 elemen SMKP Minerba menurut Permen No 26/2018!"
  ];

  return (
    <div id="ai-tutor-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] min-h-[500px] font-sans">
      
      {/* Left Column: Quick tips & prompts */}
      <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold uppercase text-xs tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Socratic Mentor Mode</span>
          </div>
          <h2 className="text-base font-bold font-display tracking-wide text-white uppercase">Tutor Pendamping Belajar</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            AI Mentor dilatih menggunakan kurikulum sertifikasi POP nasional, siap menjawab pertanyaan Anda menggunakan analogi dunia pertambangan yang mudah dicerna di lapangan keselamatan harian.
          </p>
 
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
              Topik Diskusi Cepat:
            </h4>
            <div className="space-y-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(q)}
                  className="w-full text-left p-2.5 bg-slate-800/80 hover:bg-slate-750 rounded-lg text-[11px] text-slate-300 hover:text-white transition-colors border border-slate-700/50 block line-clamp-2"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
 
        <div className="bg-slate-800/50 rounded-xl p-3.5 border border-slate-700/50 text-[10px] text-slate-400 space-y-1.5 font-mono">
          <div className="font-bold text-slate-200">INFORMASI ACUAN:</div>
          <div>✓ Kepmen ESDM 1827 K/30/MEM/2018</div>
          <div>✓ UU No. 3 Tahun 2020 Minerba</div>
          <div>✓ SMKP Minerba Indonesia</div>
        </div>
      </div>
 
      {/* Right Column: Active chat console */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Chat Console Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">Layanan Pembelajaran Interaktif</div>
              <div className="text-[10px] text-slate-500 font-mono">AI ENGINE: ACTIVE (GEMINI-3.5-FLASH)</div>
            </div>
          </div>
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-500 hover:text-slate-850 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-semibold transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="h-4 w-4 text-slate-600" />
            <span>Clear</span>
          </button>
        </div>
 
        {/* Message Feeds */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isAI ? "self-start" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    isAI ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-850"
                  }`}
                >
                  {isAI ? <Sparkles className="h-4 w-4 text-amber-500" /> : <User className="h-4 w-4 text-slate-600" />}
                </div>
 
                {/* Message Body */}
                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                      isAI
                        ? "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100/80"
                        : "bg-slate-900 text-white rounded-tr-none shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </p>
                  </div>
                  <div className={`text-[9px] text-slate-400 font-mono ${isAI ? "text-left" : "text-right"}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
 
          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="p-3.5 bg-slate-50 text-slate-400 text-xs rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                  <div className="flex space-x-1">
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span>Mentor sedang memikirkan analogi lapangan...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
 
        {/* Input area */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(input);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan mengenai isi SMKP, cara investigasi, pembuatan JSA, dll..."
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-slate-500 focus:bg-white text-xs px-4 py-3 rounded-lg outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 bg-slate-900 hover:bg-slate-850 text-white hover:text-amber-400 rounded-lg flex items-center justify-center transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-400 text-center mt-2 font-medium">
            AI dapat melakukan kesalahan. Selalu konfirmasi dengan Buku Saku POP & KTT di tambang Anda.
          </div>
        </div>
      </div>
    </div>
  );
}
