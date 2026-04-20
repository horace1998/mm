import React, { useState, useEffect } from "react";
import { useSYNK, Mission } from "../Store";
import { useFandom } from "../FandomContext";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Clock, ShieldAlert, CheckCircle2, Flame, XCircle, Zap } from "lucide-react";
import { cn } from "../utils";
import { translations, Language } from "../translations";

export default function InitiateMission() {
  const { missions, memories, addMission, deleteMission, triggerAchievement, language, bias } = useSYNK();
  const { activeConfig } = useFandom();
  const t = translations[language as Language] || translations.en;

  const [missionText, setMissionText] = useState("");
  const [durationValue, setDurationValue] = useState("1");
  const [durationUnit, setDurationUnit] = useState("weeks");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDismissConfirm, setShowDismissConfirm] = useState(false);

  const activeMission = missions.find(m => m.status === 'ACTIVE');
  const missionEvents = memories.filter(m => m.taggedMissionId === activeMission?.id);
  
  const idolName = activeConfig.members.find(m => m.id === bias)?.name || "MY IDOL";

  const handleInitiate = async () => {
    if (!missionText || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const finalDurationUnit = durationValue === "1" ? durationUnit.slice(0, -1) : durationUnit;
      await addMission(missionText, `${durationValue} ${finalDurationUnit}`);
      triggerAchievement("MISSION_INITIATED", "NEURAL_CHAIN_LINKED");
      setMissionText("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 lg:p-10 pb-32 overflow-y-auto custom-scrollbar overflow-x-hidden bg-white text-zinc-900">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-10">
        
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tighter text-zinc-900 uppercase">MISSION INITIATION</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Initiate Mission</p>
        </header>

        {activeMission ? (
          <section className="flex flex-col gap-10">
            <div className="rounded-3xl border border-zinc-100 bg-zinc-900 text-white p-10 relative overflow-hidden group shadow-sm">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Clock className="w-32 h-32" />
               </div>
               <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                     <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                     <span className="text-xs font-bold tracking-widest uppercase">ACTIVE TRANSMISSION</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-loose sm:leading-tight uppercase text-left">
                    <span className="block sm:inline">BEFORE I MEET <span className="text-green-400">{idolName}</span>, I WILL</span> <span className="bg-green-400/20 text-green-400 px-3 py-1 rounded-2xl md:rounded-[2rem] leading-normal">{activeMission.title}</span> <span className="block sm:inline mt-2 sm:mt-0">FOR <span className="bg-zinc-800 text-white px-3 py-1 border border-zinc-700/50 rounded-2xl md:rounded-[2rem] leading-normal shadow-inner">{activeMission.duration}</span>.</span>
                  </h2>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-8">
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest">TIME REMAINING FOR NEXT POW</span>
                       <CountdownTimer deadline={activeMission.nextDeadline} />
                    </div>
                    {showDismissConfirm ? (
                      <div className="flex items-center gap-2 self-start md:self-end bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-2">SURE?</span>
                        <button 
                          onClick={() => {
                            deleteMission(activeMission.id);
                            setShowDismissConfirm(false);
                          }}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-bold uppercase text-[10px] tracking-widest"
                        >
                          YES
                        </button>
                        <button 
                          onClick={() => setShowDismissConfirm(false)}
                          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-bold uppercase text-[10px] tracking-widest"
                        >
                          NO
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowDismissConfirm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors font-bold uppercase text-xs tracking-widest self-start md:self-end border border-red-500/20"
                      >
                        <XCircle className="w-4 h-4" />
                        DISMISS CHALLENGE
                      </button>
                    )}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">LAST SYNC</span>
                  <p className="text-xl font-mono font-bold text-zinc-800">
                    {activeMission.lastProofDate ? new Date(activeMission.lastProofDate.toDate()).toLocaleString() : "INITIAL STATE"}
                  </p>
               </div>
               <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">MISSION STATUS</span>
                  <p className="text-xl font-bold text-green-500">CONNECTED // SYNCHRONIZED</p>
               </div>
            </div>

            {/* Synchronization Events */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-2 text-zinc-400 px-2">
                 <Zap className="w-3 h-3" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">SYNCHRONIZATION EVENTS // PoW LOG</span>
              </div>
              
              <div className="flex flex-col gap-3">
                {missionEvents.length === 0 ? (
                  <div className="p-10 border border-dashed border-zinc-100 rounded-3xl text-center bg-zinc-50/30">
                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest leading-relaxed">No synchronization events recorded for this mission sequence.</p>
                  </div>
                ) : (
                  missionEvents.map((event, idx) => (
                    <div key={event.id || idx} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-2xl group hover:border-zinc-300 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-zinc-200 overflow-hidden flex-shrink-0 border border-zinc-100">
                             {event.media?.[0]?.type === 'image' ? (
                               <img src={event.media[0].url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                 <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
                               </div>
                             )}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">EVENT_{idx.toString().padStart(2, '0')} // SYNC_SUCCESS</span>
                             <span className="text-[9px] text-zinc-400 font-bold uppercase font-mono">
                               {event.createdAt?.toDate ? event.createdAt.toDate().toLocaleString() : new Date().toLocaleString()}
                             </span>
                          </div>
                       </div>
                       <div className="px-3 py-1 bg-white border border-zinc-100 rounded-full text-[8px] font-black text-zinc-400 uppercase tracking-widest group-hover:border-zinc-400 transition-colors">
                          PoW_VERIFIED
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-10">
            <div className="rounded-3xl border border-zinc-100 bg-white p-6 sm:p-8 md:p-12 shadow-sm">
              <div className="flex flex-col gap-6 sm:gap-8 text-xl sm:text-2xl md:text-3xl font-bold text-zinc-800 leading-relaxed uppercase tracking-tight text-left">
                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-4 sm:gap-y-6">
                  <span className="opacity-40 whitespace-nowrap">BEFORE I MEET</span>
                  <span className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-xl whitespace-nowrap">{idolName.toUpperCase()}</span>
                  <span className="opacity-40 whitespace-nowrap">, I WILL</span>
                  <div className="w-full sm:flex-1 sm:min-w-[250px] relative">
                    <input 
                      type="text" 
                      value={missionText}
                      onChange={(e) => setMissionText(e.target.value)}
                      placeholder="ENTER MISSION"
                      className="w-full bg-transparent border-b-4 border-zinc-200 pb-2 outline-none placeholder:text-zinc-300 focus:border-zinc-800 transition-colors"
                    />
                  </div>
                  <span className="opacity-40 whitespace-nowrap">FOR</span>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center w-full sm:w-auto">
                    <input 
                      type="number" 
                      min="1"
                      max="99"
                      value={durationValue}
                      onChange={(e) => setDurationValue(e.target.value)}
                      className="w-16 bg-transparent border-b-4 border-zinc-200 pb-2 outline-none text-center focus:border-zinc-800 transition-colors"
                    />
                    <select 
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value)}
                      className="bg-zinc-100 text-zinc-900 px-4 sm:px-6 py-3 rounded-xl border-none outline-none cursor-pointer hover:bg-zinc-200 transition-colors uppercase font-bold text-sm sm:text-base flex-1 sm:flex-none"
                    >
                      <option value="weeks">WEEKS</option>
                      <option value="months">MONTHS</option>
                    </select>
                  </div>
                  <span className="opacity-40 hidden sm:inline">.</span>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={handleInitiate}
                  disabled={!missionText || isSubmitting}
                  className="bg-black text-white px-10 py-5 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-20 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group shadow-lg"
                >
                  <Flame className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                  <span>INITIATE CHAIN</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Mission History */}
        <section className="flex flex-col gap-6 mt-10">
          <div className="flex items-center gap-2 text-zinc-400">
             <Clock className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-widest">MISSION LOG // ENCRYPTED ARCHIVE</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {missions.filter(m => m.status !== 'ACTIVE').map(m => (
              <div key={m.id} className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-zinc-300 transition-colors">
                  <div className="flex items-center gap-6">
                    {m.status === 'BROKEN' ? (
                      <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                          <ShieldAlert className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
                          <CheckCircle2 className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-zinc-800">{m.title}</span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{m.id.slice(0,8)} // {m.duration}</span>
                    </div>
                  </div>
                  <div className={cn(
                    "text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest mt-4 md:mt-0",
                    m.status === 'BROKEN' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                  )}>
                    {m.status}
                  </div>
              </div>
            ))}
            
            {missions.filter(m => m.status !== 'ACTIVE').length === 0 && (
              <div className="minimal-card py-20 flex flex-col items-center gap-4 text-center">
                  <ShieldAlert className="w-10 h-10 text-zinc-200" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-300">NULL ENTITY DETECTED</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function CountdownTimer({ deadline }: { deadline: any }) {
  const [timeLeft, setTimeLeft] = useState("--:--:--");
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!deadline) return;
      
      const target = deadline.toDate ? deadline.toDate() : new Date(deadline);
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        setIntensity(1);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );

      // Max 24 hours (86400000 ms)
      const ratio = Math.max(0, Math.min(1, 1 - (diff / 86400000)));
      setIntensity(ratio);
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <motion.div 
      animate={{ 
        color: intensity > 0.8 ? ['#fff', '#ef4444', '#fff'] : '#fff',
        scale: intensity > 0.9 ? [1, 1.05, 1] : 1,
        textShadow: intensity > 0.8 ? [
          '0 0 0px #ef4444',
          '0 0 20px #ef4444',
          '0 0 0px #ef4444'
        ] : 'none'
      }}
      transition={{ duration: 0.5, repeat: Infinity }}
      className="text-4xl sm:text-6xl md:text-8xl font-black italic tracking-tighter font-mono"
    >
      {timeLeft}
    </motion.div>
  );
}
