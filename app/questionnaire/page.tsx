"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const questions = [
  {
    id: 0,
    emoji: "🩸",
    tag: "Menstrual Health",
    question: "Do you experience irregular periods?",
    options: ["Yes", "No"],
    imgLeft: "/images/period2.jpg",
    imgRight: "/images/period1.jpg",
    accent: "#F472B6",
    accentDeep: "#BE185D",
    pageTint: "rgba(255,240,248,0.82)",
  },
  {
    id: 1,
    emoji: "✨",
    tag: "Skin Health",
    question: "Do you have acne issues?",
    options: ["Rarely", "Sometimes", "Frequently"],
    imgLeft: "/images/acne2.jpg",
    imgRight: "/images/acne1.jpg",
    accent: "#FB923C",
    accentDeep: "#C2410C",
    pageTint: "rgba(255,247,237,0.82)",
  },
  {
    id: 2,
    emoji: "⚖️",
    tag: "Body Weight",
    question: "Have you experienced weight gain recently?",
    options: ["Yes", "No"],
    imgLeft: "/images/weight2.jpg",
    imgRight: "/images/weight1.jpg",
    accent: "#A78BFA",
    accentDeep: "#6D28D9",
    pageTint: "rgba(245,243,255,0.82)",
  },
  {
    id: 3,
    emoji: "🌿",
    tag: "Hair Growth",
    question: "Do you have excessive hair growth?",
    options: ["Yes", "No"],
    imgLeft: "/images/hair2.jpg",
    imgRight: "/images/hair1.jpg",
    accent: "#34D399",
    accentDeep: "#065F46",
    pageTint: "rgba(236,253,245,0.82)",
  },
  {
    id: 4,
    emoji: "😴",
    tag: "Energy Levels",
    question: "Do you feel tired frequently?",
    options: ["Yes", "No"],
    imgLeft: "/images/tired2.jpg",
    imgRight: "/images/tired1.jpg",
    accent: "#60A5FA",
    accentDeep: "#1D4ED8",
    pageTint: "rgba(239,246,255,0.82)",
  },
  {
    id: 5,
    emoji: "💫",
    tag: "Mental Wellness",
    question: "Do you experience mood swings?",
    options: ["Rarely", "Sometimes", "Frequently"],
    imgLeft: "/images/swing3.jpg",
    imgRight: "/images/swing1.jpg",
    accent: "#F9A8D4",
    accentDeep: "#9D174D",
    pageTint: "rgba(253,242,248,0.82)",
  },
];

/* ══════════════════════════════════════
   OPTION BUTTON
══════════════════════════════════════ */
function OptionBtn({
  label, selected, onClick, accent, accentDeep, index,
}: {
  label: string; selected: boolean; onClick: () => void;
  accent: string; accentDeep: string; index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.3 }}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "13px 16px",
        borderRadius: 14,
        border: selected ? `2px solid ${accent}` : "1.5px solid rgba(255,255,255,0.75)",
        background: selected
          ? `linear-gradient(135deg,${accentDeep}14,${accent}22)`
          : "rgba(255,255,255,0.72)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.2s ease",
        boxShadow: selected ? `0 4px 18px ${accent}30` : "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <span style={{
        fontSize: 14, fontWeight: selected ? 600 : 400,
        color: selected ? accentDeep : "#1F2937",
        fontFamily: "inherit", letterSpacing: "-0.01em",
      }}>
        {label}
      </span>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        border: selected ? `2px solid ${accent}` : "2px solid rgba(0,0,0,0.15)",
        background: selected
          ? `linear-gradient(135deg,${accentDeep},${accent})`
          : "rgba(255,255,255,0.9)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.2s",
      }}>
        {selected && <div style={{ width:7, height:7, borderRadius:"50%", background:"white" }}/>}
      </div>
    </motion.button>
  );
}

/* ══════════════════════════════════════
   MAIN
══════════════════════════════════════ */
export default function Questionnaire() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [dir, setDir] = useState(1);
  const router = useRouter();

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  const next = () => {
    if (!selected) return;
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    if (current < questions.length - 1) {
      setDir(1); setCurrent(p => p + 1);
      setSelected(updated[current + 1] || "");
    } else {
      router.push(`/result?data=${encodeURIComponent(JSON.stringify(updated))}`);
    }
  };

  const prev = () => {
    if (current > 0) {
      setDir(-1); setCurrent(p => p - 1);
      setSelected(answers[current - 1] || "");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      fontFamily: "'DM Sans', sans-serif",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        @keyframes bgIn {
          from { opacity:0; transform:scale(1.03); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes tintIn { from{opacity:0} to{opacity:1} }
        @keyframes blobDrift {
          0%,100%{transform:scale(1);opacity:0.5}
          50%    {transform:scale(1.06);opacity:0.7}
        }

        .bg-anim   { animation: bgIn    0.75s cubic-bezier(0.22,1,0.36,1) both; }
        .tint-anim { animation: tintIn  0.5s ease both; }
        .blob      { animation: blobDrift 8s ease-in-out infinite; }
      `}</style>

      {/* ══════════════════════════════════════════
          ★ FULL SCREEN SPLIT BACKGROUND — both images
          Left half = imgLeft, Right half = imgRight
          Combined they fill the entire screen
      ══════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        <div key={`bg-${current}`} className="bg-anim" style={{
          position: "fixed", inset: 0, zIndex: 0,
          display: "flex",
        }}>
          {/* Left half image */}
          <div style={{
            flex: 1,
            backgroundImage: `url(${q.imgLeft})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.22,
          }}/>
          {/* Soft center divider — blends the two images */}
          <div style={{
            width: 80,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px)",
            flexShrink: 0,
          }}/>
          {/* Right half image */}
          <div style={{
            flex: 1,
            backgroundImage: `url(${q.imgRight})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.40,
          }}/>
        </div>
      </AnimatePresence>

      {/* Color tint over the full bg */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`tint-${current}`}
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed", inset: 0, zIndex: 1,
            background: q.pageTint,
            pointerEvents: "none",
          }}
        />
      </AnimatePresence>

      {/* Accent edge blobs */}
      <div className="blob" style={{
        position:"fixed", top:"-15%", right:"-8%",
        width:"40vw", height:"40vw", maxWidth:420,
        borderRadius:"50%",
        background:`radial-gradient(circle,${q.accent}22 0%,transparent 70%)`,
        filter:"blur(55px)", zIndex:1, pointerEvents:"none",
        transition:"background 0.7s ease",
      }}/>
      <div style={{
        position:"fixed", bottom:"-12%", left:"-6%",
        width:"35vw", height:"35vw", maxWidth:380,
        borderRadius:"50%",
        background:`radial-gradient(circle,${q.accentDeep}16 0%,transparent 70%)`,
        filter:"blur(55px)", zIndex:1, pointerEvents:"none",
        transition:"background 0.3s ease",
      }}/>

      {/* ══ CARD — centered, no side images ══ */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "100%",
        maxWidth: 500,
        padding: "20px 16px",
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity:0, y:22*dir, scale:0.97 }}
            animate={{ opacity:1, y:0,      scale:1    }}
            exit={{    opacity:0, y:-16*dir, scale:0.98 }}
            transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}
            style={{
              width: "100%",
              borderRadius: 28,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(32px) saturate(200%)",
              WebkitBackdropFilter: "blur(32px) saturate(200%)",
              border: "1px solid rgba(255,255,255,0.95)",
              padding: "28px 24px 24px",
              boxShadow: `0 24px 64px rgba(0,0,0,0.12),
                          0 4px 16px rgba(0,0,0,0.06),
                          inset 0 1px 0 rgba(255,255,255,1)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top accent line */}
            <div style={{
              position:"absolute", top:0, left:"15%", right:"15%", height:2,
              background:`linear-gradient(90deg,transparent,${q.accent},${q.accentDeep},${q.accent},transparent)`,
              borderRadius:"0 0 4px 4px",
            }}/>

            {/* Corner bloom */}
            <div style={{
              position:"absolute", top:-40, right:-40,
              width:130, height:130, borderRadius:"50%",
              background:`${q.accent}18`, pointerEvents:"none",
            }}/>
            <div style={{
              position:"absolute", bottom:-30, left:-30,
              width:100, height:100, borderRadius:"50%",
              background:`${q.accentDeep}10`, pointerEvents:"none",
            }}/>

            {/* ── Tag + Step ── */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{
                display:"flex",alignItems:"center",gap:6,
                padding:"5px 12px",borderRadius:99,
                background:`${q.accent}1a`,
                border:`1px solid ${q.accent}40`,
              }}>
                <span style={{fontSize:12}}>{q.emoji}</span>
                <span style={{
                  fontSize:11,fontWeight:600,color:q.accentDeep,
                  letterSpacing:".07em",textTransform:"uppercase",
                }}>{q.tag}</span>
              </div>
              <span style={{fontSize:12,color:"#6B7280",fontWeight:500}}>
                {current+1} / {questions.length}
              </span>
            </div>

            {/* ── Progress bar ── */}
            <div style={{
              width:"100%",height:5,borderRadius:99,
              background:"rgba(0,0,0,0.07)",marginBottom:22,overflow:"hidden",
            }}>
              <motion.div
                animate={{width:`${progress}%`}}
                transition={{duration:0.5,ease:"easeOut"}}
                style={{
                  height:"100%",borderRadius:99,
                  background:`linear-gradient(90deg,${q.accentDeep},${q.accent})`,
                  boxShadow:`0 0 8px ${q.accent}88`,
                }}
              />
            </div>

            {/* ── Question ── */}
            <motion.h2
              key={`q-${current}`}
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              transition={{duration:0.3,delay:0.06}}
              style={{
                fontFamily:"'Fraunces',serif",
                fontSize:"clamp(21px,3.8vw,26px)",
                fontWeight:700, color:"#111827",
                lineHeight:1.3, marginBottom:20,
                letterSpacing:"-0.02em",
              }}
            >
              {q.question}
            </motion.h2>

            {/* ── Options ── */}
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {q.options.map((opt,i)=>(
                <OptionBtn
                  key={opt} label={opt}
                  selected={selected===opt}
                  onClick={()=>setSelected(opt)}
                  accent={q.accent} accentDeep={q.accentDeep}
                  index={i}
                />
              ))}
            </div>

            {/* ── Footer ── */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <button
                onClick={prev} disabled={current===0}
                style={{
                  background:"none",border:"none",
                  cursor:current===0?"default":"pointer",
                  fontFamily:"inherit",fontSize:14,fontWeight:500,
                  color:current===0?"rgba(0,0,0,0.2)":"#6B7280",
                  padding:"8px 4px",transition:"color 0.2s",
                }}
              >← Back</button>

              {/* Step dots */}
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                {questions.map((_,i)=>(
                  <div key={i} style={{
                    height:5,borderRadius:99,
                    width:i===current?22:6,
                    background:i===current
                      ?`linear-gradient(90deg,${q.accentDeep},${q.accent})`
                      :i<current?`${q.accent}55`:"rgba(0,0,0,0.1)",
                    transition:"all .35s cubic-bezier(.34,1.56,.64,1)",
                  }}/>
                ))}
              </div>

              <motion.button
                whileHover={selected?{scale:1.05}:{}}
                whileTap={selected?{scale:0.96}:{}}
                onClick={next}
                style={{
                  padding:"11px 22px",borderRadius:99,border:"none",
                  cursor:selected?"pointer":"not-allowed",
                  fontFamily:"inherit",fontSize:14,fontWeight:600,
                  color:selected?"white":"rgba(0,0,0,0.2)",
                  background:selected
                    ?`linear-gradient(135deg,${q.accentDeep},${q.accent})`
                    :"rgba(0,0,0,0.07)",
                  boxShadow:selected?`0 6px 20px ${q.accent}55`:"none",
                  transition:"all 0.25s ease",
                  letterSpacing:"0.01em",
                }}
              >
                {current===questions.length-1?"See Results ✨":"Next →"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

