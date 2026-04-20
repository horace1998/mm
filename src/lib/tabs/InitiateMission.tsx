import React, { useState, useEffect } from "react";
import { useSYNK, Mission } from "../Store";
import { useFandom } from "../FandomContext";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Clock, ShieldAlert, CheckCircle2, Flame, XCircle, Zap } from "lucide-react";
import { cn } from "../utils";
import { translations, Language } from "../translations";

function Typewriter({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (index === texts.length) return;

    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 50 : 100, Math.random() * 100));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  return (
    <span className="flex items-center">
      {texts[index].substring(0, subIndex)}
      <span className={cn("ml-1 w-1 h-[0.8em] bg-zinc-400 block", blink ? "opacity-100" : "opacity-0")} />
    </span>
  );
}

const MISSION_SUGGESTIONS = [
  "master conversational Korean",
  "earn my driving license",
  "build a daily gym routine",
  "follow a clean diet",
  "save 30 percent of my income",
  "master a full dance choreography"
];

export default function InitiateMission() {
  const { user, missions, memories, addMission, deleteMission, triggerAchievement, language, bias } = useSYNK();
  const { activeConfig } = useFandom();
  const t = translations[language as Language] || translations.en;

  const [missionText, setMissionText] = useState("");
  const [durationValue, setDurationValue] = useState("1");
  const [durationUnit, setDurationUnit] = useState("weeks");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDismissConfirm, setShowDismissConfirm] = useState(false);
  
  // Typewriter state for suggestions
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isReversing, setIsReversing] = useState(false);

  useEffect(() => {
    if (missionText) return; // Stop suggestions if user types

    const text = MISSION_SUGGESTIONS[suggestionIdx];
    
    if (charIdx === text.length + 1 && !isReversing) {
      const timeout = setTimeout(() => setIsReversing(true), 2500);
      return () => clearTimeout(timeout);
    }

    if (charIdx === 0 && isReversing) {
      setIsReversing(false);
      setSuggestionIdx((prev) => (prev + 1) % MISSION_SUGGESTIONS.length);
      return;
    }

    const speed = isReversing ? 40 : 80;
    const timeout = setTimeout(() => {
      setCharIdx((prev) => prev + (isReversing ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIdx, isReversing, suggestionIdx, missionText]);

  const activeMission = missions.find(m => m.status === 'ACTIVE');
  const missionEvents = memories.filter(m => m.taggedMissionId === activeMission?.id);
  
  const idolName = activeConfig.members.find(m => m.id === bias)?.name || "MY IDOL";

  const handleInitiate = async () => {
    const finalMissionText = missionText.trim() || MISSION_SUGGESTIONS[suggestionIdx];
    if (!finalMissionText || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const finalDurationUnit = durationValue === "1" ? durationUnit.slice(0, -1) : durationUnit;
      await addMission(finalMissionText, `${durationValue} ${finalDurationUnit}`);
      triggerAchievement("MISSION INITIATED", "NEURAL CHAIN LINKED");
      setMissionText("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 lg:p-12 pb-32 overflow-y-auto custom-scrollbar overflow-x-hidden bg-white text-zinc-900">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-12">
        
        {/* Header Archive Meta */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-zinc-900" />
              <span className="text-[10px] font-black tracking-[0.4em] text-zinc-900 uppercase">SYS CONTROL // MISSIONS</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 uppercase leading-none">INITIATION</h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1 font-mono">
            {/* Metadata removed for minimalism */}
          </div>
        </header>

        {activeMission ? (
          <section className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Mission Directive Rail */}
            <div className="relative border-4 border-zinc-900 p-8 md:p-16 overflow-hidden">
               {/* Background Grid Accent */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
               
               {/* Metadata Rails removed for minimalism */}
               <div className="absolute top-0 inset-x-0 h-1 bg-zinc-900/5" />

               <div className="relative z-10 flex flex-col gap-10">
                  <div className="flex items-center gap-4">
                     <div className="px-3 py-1 bg-zinc-900 text-white text-[8px] font-black tracking-[0.3em] uppercase">SYSTEM LINK ACTIVE</div>
                     <span className="text-[10px] font-bold text-zinc-400 font-mono italic">ESTABLISHED: {activeMission.createdAt?.toDate ? activeMission.createdAt.toDate().toISOString().split('T')[0] : 'PRESENT'}</span>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">TARGET IDENTITY</span>
                      <h3 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 leading-none italic uppercase">
                        {idolName}
                      </h3>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">MISSION OBJECTIVE</span>
                      <p className="text-2xl md:text-4xl font-black text-zinc-900 tracking-tight leading-tight uppercase border-l-8 border-zinc-900 pl-6 py-2">
                        {activeMission.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                       <div className="flex flex-col">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">DURATION</span>
                         <span className="text-sm font-black text-zinc-900 uppercase tracking-widest">{activeMission.duration}</span>
                       </div>
                       <div className="w-px h-8 bg-zinc-200" />
                       <div className="flex flex-col">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">PROG STATE</span>
                         <span className="text-sm font-black text-green-600 uppercase tracking-widest">SYNCHRONIZED</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 mt-6 border-t border-zinc-900/10 pt-10">
                    <div className="flex flex-col gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-600 animate-pulse" />
                          <span className="text-[10px] text-zinc-900 font-black uppercase tracking-[0.4em]">TIME UNTIL SYNC COLLAPSE</span>
                       </div>
                       <CountdownTimer deadline={activeMission.nextDeadline} />
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-auto">
                      {showDismissConfirm ? (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-900/10 rounded-2xl">
                          <span className="text-[10px] font-black text-red-900 uppercase tracking-widest px-2">ABORT MISSION?</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                deleteMission(activeMission.id);
                                setShowDismissConfirm(false);
                              }}
                              className="px-6 py-2 bg-red-900 text-white font-black uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md"
                            >
                              CONFIRM
                            </button>
                            <button 
                              onClick={() => setShowDismissConfirm(false)}
                              className="px-6 py-2 bg-zinc-200 text-zinc-900 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-300 transition-all"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShowDismissConfirm(true)}
                          className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-zinc-900 hover:bg-zinc-900 hover:text-white text-zinc-900 transition-all font-black uppercase text-[10px] tracking-[0.3em] active:scale-95 group"
                        >
                          <XCircle className="w-4 h-4" />
                          ABORT DIRECTIVE
                        </button>
                      )}
                    </div>
                  </div>
               </div>
            </div>

            {/* Quick Context Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="border border-zinc-900 p-8 flex flex-col gap-4 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-zinc-900 transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">LAST SUCCESSFUL HANDSHAKE</span>
                  <p className="text-2xl font-mono font-black text-zinc-900">
                    {activeMission.lastProofDate ? new Date(activeMission.lastProofDate.toDate()).toISOString().replace('T', ' ').slice(0, 19) : "INIT STATE 00"}
                  </p>
                  <p className="text-[8px] text-zinc-300 uppercase font-bold tracking-[0.2em]">PROTOCOL: SYNC VERIFIED</p>
               </div>
               <div className="border border-zinc-900 p-8 flex flex-col gap-4 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-zinc-900 transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">TOTAL SYNCS RECORDED</span>
                  <p className="text-2xl font-mono font-black text-zinc-900 tracking-tighter">
                    {missionEvents.length.toString().padStart(3, '0')} // SYNC BURST: {Math.floor(Math.random() * 100)}%
                  </p>
                  <p className="text-[8px] text-zinc-300 uppercase font-bold tracking-[0.2em]">STATE: SYNCHRONIZED</p>
               </div>
            </div>

            {/* Synchronization Events */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-2 text-zinc-400 px-2">
                 <Zap className="w-3 h-3" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">SYNCHRONIZATION EVENTS // POW LOG</span>
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
                             <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">EVENT {idx.toString().padStart(2, '0')} // SYNC SUCCESS</span>
                             <span className="text-[9px] text-zinc-400 font-bold uppercase font-mono">
                               {event.createdAt?.toDate ? event.createdAt.toDate().toLocaleString() : new Date().toLocaleString()}
                             </span>
                          </div>
                       </div>
                       <div className="px-3 py-1 bg-white border border-zinc-100 rounded-full text-[8px] font-black text-zinc-400 uppercase tracking-widest group-hover:border-zinc-400 transition-colors">
                          POW VERIFIED
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 py-12">
            <div className="flex flex-col gap-20">
               <div className="flex flex-wrap items-baseline gap-x-6 gap-y-12 text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
                  <span className="text-zinc-300">BEFORE I MEET</span>
                  <div className="px-6 py-2 bg-zinc-900 text-white transform -rotate-1 shadow-2xl relative inline-block">
                     {idolName}
                     <div className="absolute -top-1 -right-1 w-2 h-2 bg-zinc-900" />
                  </div>
                  <span className="text-zinc-300">, I WILL</span>
                  
                  <div className="relative inline-block min-w-[320px] border-b-[10px] border-zinc-900 pb-2 flex-1">
                     <input 
                       type="text" 
                       value={missionText}
                       onChange={(e) => setMissionText(e.target.value.slice(0, 50))}
                       className="w-full bg-transparent outline-none placeholder:text-zinc-200 uppercase font-black"
                       autoFocus
                     />
                     {!missionText && (
                       <div className="absolute inset-0 flex items-center justify-start pointer-events-none text-zinc-200 uppercase font-black overflow-hidden">
                          <div className="whitespace-nowrap flex items-center">
                            {MISSION_SUGGESTIONS[suggestionIdx].substring(0, charIdx)}
                            <div className="ml-1 w-2 h-[0.8em] bg-zinc-400 animate-pulse flex-shrink-0" />
                          </div>
                       </div>
                     )}
                     <div className="absolute -bottom-10 right-0 text-[10px] font-black text-zinc-300">
                        {missionText.length}/50
                     </div>
                  </div>

                  <span className="text-zinc-300">FOR THE NEXT</span>

                  <div className="flex items-center gap-4 border-b-[10px] border-zinc-900 pb-2">
                     <input 
                       type="number" 
                       min="1"
                       max="99"
                       value={durationValue}
                       onChange={(e) => setDurationValue(e.target.value)}
                       className="w-24 md:w-32 bg-transparent outline-none text-center font-black"
                     />
                     <select 
                       value={durationUnit}
                       onChange={(e) => setDurationUnit(e.target.value)}
                       className="bg-transparent outline-none cursor-pointer uppercase font-black text-3xl md:text-5xl lg:text-7xl appearance-none"
                     >
                       <option value="days">DAYS</option>
                       <option value="weeks">WEEKS</option>
                       <option value="months">MONTHS</option>
                     </select>
                  </div>
               </div>

               <button 
                 onClick={handleInitiate}
                 disabled={isSubmitting}
                 className="relative group bg-zinc-900 text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all active:scale-[0.98] w-full md:w-auto self-start shadow-xl disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden mt-4"
               >
                 <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                 <div className="relative z-10 flex items-center justify-center gap-3">
                    <Flame className="w-4 h-4 text-green-400" />
                    <span>INITIATE CHAIN</span>
                 </div>
               </button>
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
        color: intensity > 0.8 ? ['#18181b', '#ef4444', '#18181b'] : '#18181b',
        scale: intensity > 0.9 ? [1, 1.02, 1] : 1,
      }}
      transition={{ duration: 0.5, repeat: Infinity }}
      className="text-6xl sm:text-8xl md:text-9xl font-black italic tracking-tighter font-mono text-zinc-900 leading-none"
    >
      {timeLeft}
    </motion.div>
  );
}
