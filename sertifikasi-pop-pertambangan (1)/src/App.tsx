import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import ModulMateri from "./components/ModulMateri";
import AITutor from "./components/AITutor";
import AIAssessor from "./components/AIAssessor";
import SimulasiUjian from "./components/SimulasiUjian";
import Login from "./components/Login";
import { UserProfile, AssessmentRecord, ExamRecord } from "./types";
import { 
  Sparkles, 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  UserCheck, 
  Timer, 
  ShieldAlert, 
  Users, 
  CloudOff,
  CloudLightning,
  Database,
  LogIn,
  LogOut,
  RefreshCw,
  Loader2
} from "lucide-react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, isRealFirebase } from "./firebase";
import { 
  saveUserProfile, 
  getUserProfile, 
  getCompletedModules, 
  saveCompletedModules, 
  getAssessments, 
  saveAssessmentRecord, 
  getExams, 
  saveExamRecord 
} from "./firebaseService";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedModuleForTutor, setSelectedModuleForTutor] = useState<string | null>(null);
  const [selectedModuleForAssessment, setSelectedModuleForAssessment] = useState<string | null>(null);
  
  // Auth and sync state
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<"offline" | "synced" | "error" | "none">("none");
  const [isLogged, setIsLogged] = useState<boolean>(false);

  // Authenticated User profile state mapping
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    userId: "",
    email: "",
    name: "",
    role: "student",
  });

  // Client states
  const [completedModules, setCompletedModules] = useState<{ [key: string]: boolean }>({});
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [exams, setExams] = useState<ExamRecord[]>([]);

  // 1. Initial State Load (Local storage fallbacks)
  useEffect(() => {
    const localModules = localStorage.getItem("pop_completed_modules");
    if (localModules) {
      setCompletedModules(JSON.parse(localModules));
    }
    const localAssessments = localStorage.getItem("pop_assessments_log");
    if (localAssessments) {
      setAssessments(JSON.parse(localAssessments));
    }
    const localExams = localStorage.getItem("pop_exams_log");
    if (localExams) {
      setExams(JSON.parse(localExams));
    }
  }, []);

  // 2. Auth state Listener & Firestore loader
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      if (firebaseUser) {
        setIsLogged(true);
        const uid = firebaseUser.uid;
        const defaultProfile: UserProfile = {
          userId: uid,
          email: firebaseUser.email || "participant-pop@minerba.org",
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Ahmad Rifai",
          role: "student",
        };

        try {
          setSyncing(true);
          // 1. Save or sync user profile
          await saveUserProfile(defaultProfile);
          
          // 2. Loads existing profile
          const profile = await getUserProfile(uid);
          if (profile) {
            setCurrentUser(profile);
          } else {
            setCurrentUser(defaultProfile);
          }

          // 3. Sync materials progress
          const cloudModules = await getCompletedModules(uid);
          // Merge local & cloud (local progress takes precedent or merged)
          const mergedModules = { ...completedModules, ...cloudModules };
          setCompletedModules(mergedModules);
          await saveCompletedModules(uid, mergedModules);
          localStorage.setItem("pop_completed_modules", JSON.stringify(mergedModules));

          // 4. Sync assessments logs
          const cloudAssessments = await getAssessments(uid);
          setAssessments(cloudAssessments);
          localStorage.setItem("pop_assessments_log", JSON.stringify(cloudAssessments));

          // 5. Sync exam sheets
          const cloudExams = await getExams(uid);
          setExams(cloudExams);
          localStorage.setItem("pop_exams_log", JSON.stringify(cloudExams));

          setSyncStatus("synced");
        } catch (err) {
          console.error("Failed to sync cloud databases. Falling back to local offline profile:", err);
          setSyncStatus("error");
          setCurrentUser(defaultProfile);
        } finally {
          setSyncing(false);
        }
      } else {
        setIsLogged(false);
        setSyncStatus("offline");
        // Reset to empty state
        setCurrentUser({
          userId: "",
          email: "",
          name: "",
          role: "student",
        });
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Local Storage Mirroring for Fallback
  useEffect(() => {
    if (Object.keys(completedModules).length > 0) {
      localStorage.setItem("pop_completed_modules", JSON.stringify(completedModules));
    }
  }, [completedModules]);

  useEffect(() => {
    if (assessments.length > 0) {
      localStorage.setItem("pop_assessments_log", JSON.stringify(assessments));
    }
  }, [assessments]);

  useEffect(() => {
    if (exams.length > 0) {
      localStorage.setItem("pop_exams_log", JSON.stringify(exams));
    }
  }, [exams]);

  // Auth actions
  const handleGoogleLogin = async () => {
    try {
      setSyncing(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login Error:", err);
      alert("Gagal Masuk menggunakan Google: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      setSyncing(true);
      await signOut(auth);
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleModuleComplete = async (moduleId: string) => {
    const updated = {
      ...completedModules,
      [moduleId]: !completedModules[moduleId],
    };
    setCompletedModules(updated);
    
    if (isLogged && auth.currentUser) {
      try {
        await saveCompletedModules(auth.currentUser.uid, updated);
      } catch (err) {
        console.error("Cloud synchronization failed for modules toggle:", err);
      }
    }
  };

  const handleSaveAssessment = async (record: AssessmentRecord) => {
    setAssessments((prev) => [record, ...prev]);
    
    if (isLogged && auth.currentUser) {
      try {
        await saveAssessmentRecord(record);
      } catch (err) {
        console.error("Cloud synchronization failed for assessment run:", err);
      }
    }
  };

  const handleSaveExam = async (record: ExamRecord) => {
    setExams((prev) => [record, ...prev]);
    
    if (isLogged && auth.currentUser) {
      try {
        await saveExamRecord(record);
      } catch (err) {
        console.error("Cloud synchronization failed for exam scorecard:", err);
      }
    }
  };

  const handleLaunchTutor = (moduleTitle: string) => {
    setSelectedModuleForTutor(moduleTitle);
    setActiveTab("tutor");
    // Clear out standard load variables so we don't reload trigger
    setTimeout(() => setSelectedModuleForTutor(null), 100);
  };

  const handleLaunchAssessment = (moduleTitle: string) => {
    setSelectedModuleForAssessment(moduleTitle);
    setActiveTab("assessor");
    setTimeout(() => setSelectedModuleForAssessment(null), 100);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Memuat Sesi POP...
          </p>
        </div>
      </div>
    );
  }

  if (!isLogged) {
    return (
      <Login onLogin={handleGoogleLogin} loading={syncing} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* Platform Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Title / Logo */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md">
                <span>P</span>
              </div>
              <div>
                <span className="font-display font-bold text-sm sm:text-base text-white block tracking-wide uppercase">
                  POP AI-Expert
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-normal block">
                  Certify with Confidence
                </span>
              </div>
            </div>

            {/* Navigation Tabs bar */}
            <nav className="hidden md:flex items-center gap-1 h-full">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 h-16 text-xs font-bold transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === "dashboard" 
                    ? "border-amber-500 text-amber-500 bg-amber-500/10 font-bold" 
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("materi")}
                className={`px-4 h-16 text-xs font-bold transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === "materi" 
                    ? "border-amber-500 text-amber-500 bg-amber-500/10 font-bold" 
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Learning Modules
              </button>
              <button
                onClick={() => setActiveTab("tutor")}
                className={`px-4 h-16 text-xs font-bold transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === "tutor" 
                    ? "border-amber-500 text-amber-500 bg-amber-500/10 font-bold" 
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Brain className="h-4 w-4" />
                AI Tutor Mode
              </button>
              <button
                onClick={() => setActiveTab("assessor")}
                className={`px-4 h-16 text-xs font-bold transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === "assessor" 
                    ? "border-amber-500 text-amber-500 bg-amber-500/10 font-bold" 
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <UserCheck className="h-4 w-4" />
                AI Assessor Mode
              </button>
              <button
                onClick={() => setActiveTab("simulasi")}
                className={`px-4 h-16 text-xs font-bold transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === "simulasi" 
                    ? "border-amber-500 text-amber-500 bg-amber-500/10 font-bold" 
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Timer className="h-4 w-4" />
                Exam Simulations
              </button>
            </nav>

            {/* Right side role switches & Firebase authentication */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center bg-slate-850 border border-slate-750 p-1 rounded-lg gap-1">
                <Users className="h-3.5 w-3.5 text-slate-400 ml-1.5" />
                <span className="text-[10px] text-slate-400 font-bold mr-1 uppercase">Role:</span>
                {["student", "instructor", "admin"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setCurrentUser((u) => ({ ...u, role: role as any }))}
                    className={`px-2 py-1 text-[10px] uppercase font-mono font-bold rounded transition-colors ${
                      currentUser.role === role ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Login/Logout Button */}
              {authLoading ? (
                <div className="flex items-center gap-1 py-1.5 px-3 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-300 font-bold">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Loading Auth</span>
                </div>
              ) : isLogged ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex flex-col items-end text-right leading-none">
                    <span className="text-xs font-bold text-white">{currentUser.name}</span>
                    <span className="text-[9px] text-amber-500 font-mono italic">
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>
                  {auth.currentUser?.photoURL ? (
                    <img 
                      src={auth.currentUser.photoURL} 
                      alt="Avatar" 
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full border border-slate-700"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs uppercase shadow">
                      {currentUser.name[0]}
                    </div>
                  )}
                  <button 
                    onClick={handleLogout}
                    title="Keluar Akun"
                    className="p-1.5 rounded-lg border border-slate-700 hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  disabled={syncing}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-sans flex items-center gap-1.5 shadow-md transition active:scale-95 disabled:opacity-50 shrink-0"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Google Login</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Dynamic State-driven Firebase Connection Banner */}
      <div className={`border-b transition duration-300 py-3.5 px-6 ${
        syncStatus === "synced" 
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800" 
          : syncStatus === "error"
          ? "bg-red-500/10 border-red-500/20 text-red-800"
          : "bg-amber-50 border-b border-amber-100 text-amber-800"
      }`}>
        <div className="max-w-7xl mx-auto font-sans flex flex-col gap-2">
          <div className="flex items-center gap-1.5 leading-relaxed text-xs sm:text-sm">
            {syncStatus === "synced" ? (
              <>
                <CloudLightning className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>✓ Firestore Real-Time Database Online:</strong> Sesi pembelajaran dan simulasi disinkronisasi hiterately untuk akun <strong>{currentUser.email}</strong>.
                </span>
              </>
            ) : syncStatus === "error" ? (
              <>
                <CloudOff className="h-4 w-4 text-red-600 shrink-0 animate-pulse" />
                <span>
                  <strong>⚠ Cloud Sync Error:</strong> Gagal terhubung ke remote database. Pembelajaran tetap berjalan aman dalam format penyimpanan sandbox browser offline-first.
                </span>
              </>
            ) : (
              <>
                <CloudOff className="h-4 w-4 text-amber-700 shrink-0" />
                <span>
                  <strong>☁ Mode Mandiri (Offline-First):</strong> Hubungkan dengan Google Login untuk mengaktifkan real-time backup & cloud-sync database serverless di Firebase Anda!
                </span>
              </>
            )}
          </div>
          <div>
            <span className={`text-[9px] px-2.5 py-1 rounded-md font-mono font-bold uppercase tracking-widest border shadow-sm ${
              syncStatus === "synced"
                ? "bg-emerald-500/20 text-emerald-900 border-emerald-300/30"
                : syncStatus === "error"
                ? "bg-red-500/10 text-red-900 border-red-200/30 animate-pulse"
                : "bg-amber-100/80 text-amber-800 border-amber-200/60"
            }`}>
              {syncStatus === "synced" ? "Firestore Sync Active" : syncStatus === "error" ? "Offline Cache Mode" : "Local Storage Mode"}
            </span>
          </div>
        </div>
      </div>


      {/* Active Workspace tabs rendering */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Render Mobile helper navigation */}
        <div className="flex md:hidden overflow-x-auto gap-1 pb-4 mb-4 border-b border-zinc-100 scrollbar-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 shrink-0 rounded-lg text-xs font-bold ${
              activeTab === "dashboard" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("materi")}
            className={`px-4 py-2 shrink-0 rounded-lg text-xs font-bold ${
              activeTab === "materi" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600"
            }`}
          >
            Materi
          </button>
          <button
            onClick={() => setActiveTab("tutor")}
            className={`px-4 py-2 shrink-0 rounded-lg text-xs font-bold ${
              activeTab === "tutor" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600"
            }`}
          >
            AI Tutor
          </button>
          <button
            onClick={() => setActiveTab("assessor")}
            className={`px-4 py-2 shrink-0 rounded-lg text-xs font-bold ${
              activeTab === "assessor" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600"
            }`}
          >
            AI Assessor
          </button>
          <button
            onClick={() => setActiveTab("simulasi")}
            className={`px-4 py-2 shrink-0 rounded-lg text-xs font-bold ${
              activeTab === "simulasi" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600"
            }`}
          >
            Simulasi Ujian
          </button>
        </div>

        {/* Dynamic active screen components switcher */}
        {activeTab === "dashboard" && (
          <Dashboard
            user={currentUser}
            assessments={assessments}
            exams={exams}
            completedModules={completedModules}
            onSelectTab={setActiveTab}
            onSelectModule={(mid) => {
              setSelectedModuleForTutor(null);
              setActiveTab("materi");
            }}
          />
        )}

        {activeTab === "materi" && (
          <ModulMateri
            completedModules={completedModules}
            onToggleComplete={handleToggleModuleComplete}
            onLaunchTutor={handleLaunchTutor}
            onLaunchAssessment={handleLaunchAssessment}
          />
        )}

        {activeTab === "tutor" && (
          <AITutor initialTopic={selectedModuleForTutor} />
        )}

        {activeTab === "assessor" && (
          <AIAssessor
            initialTopic={selectedModuleForAssessment}
            onSaveAssessment={handleSaveAssessment}
          />
        )}

        {activeTab === "simulasi" && (
          <SimulasiUjian onSaveExam={handleSaveExam} />
        )}

      </main>

      {/* Modern Platform Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-white font-bold flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
              POPVirtual Agentic Platform
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed max-w-md">
              Sistem pendamping belajar persiapan evaluasi kompetensi Pengawas Operasional Pertama fungsional ESDM. Semua simulasi ditenagai oleh kecerdasan buatan berintegrasi aman hiterately.
            </p>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            © 2026 POPVirtual Minerba. All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
