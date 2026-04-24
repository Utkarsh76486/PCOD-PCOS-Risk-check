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
    accent: "#F472B6",
    accentDeep: "#BE185D",
    meshA: "#F472B628",
    meshB: "#BE185D18",
  },
  {
    id: 1,
    emoji: "✨",
    tag: "Skin Health",
    question: "Do you have acne issues?",
    options: ["Rarely", "Sometimes", "Frequently"],
    accent: "#FB923C",
    accentDeep: "#C2410C",
    meshA: "#FB923C28",
    meshB: "#C2410C18",
  },
  {
    id: 2,
    emoji: "⚖️",
    tag: "Body Weight",
    question: "Have you experienced weight gain recently?",
    options: ["Yes", "No"],
    accent: "#A78BFA",
    accentDeep: "#6D28D9",
    meshA: "#A78BFA28",
    meshB: "#6D28D918",
  },
  {
    id: 3,
    emoji: "🌿",
    tag: "Hair Growth",
    question: "Do you have excessive hair growth?",
    options: ["Yes", "No"],
    accent: "#34D399",
    accentDeep: "#065F46",
    meshA: "#34D39928",
    meshB: "#065F4618",
  },
  {
    id: 4,
    emoji: "😴",
    tag: "Energy Levels",
    question: "Do you feel tired frequently?",
    options: ["Yes", "No"],
    accent: "#60A5FA",
    accentDeep: "#1D4ED8",
    meshA: "#60A5FA28",
    meshB: "#1D4ED818",
  },
  {
    id: 5,
    emoji: "💫",
    tag: "Mental Wellness",
    question: "Do you experience mood swings?",
    options: ["Rarely", "Sometimes", "Frequently"],
    accent: "#F9A8D4",
    accentDeep: "#9D174D",
    meshA: "#F9A8D428",
    meshB: "#9D174D18",
  },
];

/* ══════════════════════════════════════
   OPTION BUTTON — dark theme
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
        border: selected
          ? `1.5px solid ${accent}60`
          : "1.5px solid rgba(255,255,255,0.09)",
        background: selected
          ? `linear-gradient(135deg,${accentDeep}28,${accent}22)`
          : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.2s ease",
        boxShadow: selected ? `0 4px 20px ${accent}25` : "none",
      }}
    >
      <span style={{
        fontSize: 14,
        fontWeight: selected ? 600 : 400,
        color: selected ? accent : "rgba(255,255,255,0.65)",
        fontFamily: "inherit",
        letterSpacing: "-0.01em",
      }}>
        {label}
      </span>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        border: selected ? `2px solid ${accent}` : "2px solid rgba(255,255,255,0.18)",
        background: selected
          ? `linear-gradient(135deg,${accentDeep},${accent})`
          : "rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.2s",
      }}>
        {selected && (
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />
        )}
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
  const [showResultPreview, setShowResultPreview] = useState(false);
  const router = useRouter();

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const answeredCount = answers.filter(Boolean).length;

  const next = () => {
    if (!selected) return;
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    if (current < questions.length - 1) {
      setDir(1);
      setCurrent((p) => p + 1);
      setSelected(updated[current + 1] || "");
    } else {
      router.push(`/result?data=${encodeURIComponent(JSON.stringify(updated))}`);
    }
  };

  const prev = () => {
    if (current > 0) {
      setDir(-1);
      setCurrent((p) => p - 1);
      setSelected(answers[current - 1] || "");
    }
  };

  const goToResult = () => {
    const filled = [...answers];
    if (selected) filled[current] = selected;
    router.push(`/result?data=${encodeURIComponent(JSON.stringify(filled))}`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      maxHeight: "100vh",
      overflow: "hidden",
      position: "relative",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        @keyframes m1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(35px,-25px) scale(1.08)} }
        @keyframes m2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-28px,32px) scale(1.06)} }
        @keyframes m3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,18px)} }
        @keyframes blobDrift { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .blob { animation: blobDrift 8s ease-in-out infinite; }
        .mesh1 { animation: m1 12s ease-in-out infinite; }
        .mesh2 { animation: m2 14s ease-in-out infinite; }
        .mesh3 { animation: m3 10s ease-in-out infinite; }
      `}</style>

      {/* ══ DARK BASE ══ */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "linear-gradient(135deg,#08080f 0%,#0e0919 35%,#110c1c 65%,#090b14 100%)",
        transition: "background 0.7s ease",
      }} />

      {/* ══ ANIMATED MESH BLOBS ══ */}
      <div className="mesh1" style={{
        position: "fixed", top: "-20%", left: "-10%",
        width: "60vw", height: "60vw", maxWidth: 700,
        borderRadius: "50%",
        background: `radial-gradient(circle,${q.meshA} 0%,transparent 65%)`,
        filter: "blur(72px)", pointerEvents: "none", zIndex: 1,
        transition: "background 0.8s ease",
      }} />
      <div className="mesh2" style={{
        position: "fixed", bottom: "-15%", right: "-10%",
        width: "55vw", height: "55vw", maxWidth: 650,
        borderRadius: "50%",
        background: `radial-gradient(circle,${q.meshB} 0%,transparent 65%)`,
        filter: "blur(72px)", pointerEvents: "none", zIndex: 1,
        transition: "background 0.8s ease",
      }} />
      <div className="mesh3" style={{
        position: "fixed", top: "40%", left: "38%",
        width: "40vw", height: "40vw", maxWidth: 500,
        borderRadius: "50%",
        background: `radial-gradient(circle,${q.meshA} 0%,transparent 70%)`,
        filter: "blur(80px)", pointerEvents: "none", zIndex: 1,
        transition: "background 0.8s ease",
        opacity: 0.5,
      }} />

      {/* ══ GRID OVERLAY ══ */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),
                          linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)`,
        backgroundSize: "44px 44px",
      }} />

      {/* ══ TOP BAR — PCOS branding + View Results ══ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          background: "rgba(8,8,15,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `linear-gradient(135deg,${q.accentDeep},${q.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, transition: "background 0.5s",
            boxShadow: `0 4px 12px ${q.accent}40`,
          }}>🩺</div>
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            fontFamily: "'Fraunces',serif",
            letterSpacing: "-0.01em",
          }}>PCOS Check</span>
        </div>

        {/* View Results pill — only shows if at least 1 answered */}
        <AnimatePresence>
          {answeredCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.88, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={goToResult}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 99,
                background: `linear-gradient(135deg,${q.accentDeep},${q.accent})`,
                border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                color: "white", letterSpacing: "0.01em",
                boxShadow: `0 4px 16px ${q.accent}45`,
                transition: "box-shadow 0.3s",
              }}
            >
              <span>View Results</span>
              <span style={{ fontSize: 11 }}>→</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ══ CARD ══ */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "100%", maxWidth: 480,
        padding: "16px 16px",
        marginTop: 56,
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 22 * dir, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 * dir, scale: 0.98 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%",
              borderRadius: 28,
              background: "rgba(255,255,255,0.055)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.11)",
              padding: "24px 22px 20px",
              boxShadow: `0 32px 80px rgba(0,0,0,0.5),
                          0 0 0 1px rgba(255,255,255,0.04),
                          inset 0 1px 0 rgba(255,255,255,0.1)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
              background: `linear-gradient(90deg,transparent,${q.accentDeep},${q.accent},${q.accentDeep},transparent)`,
              borderRadius: "0 0 4px 4px",
              transition: "background 0.6s ease",
            }} />

            {/* Corner blooms */}
            <div style={{
              position: "absolute", top: -50, right: -50,
              width: 150, height: 150, borderRadius: "50%",
              background: `${q.accent}12`, pointerEvents: "none",
              transition: "background 0.6s",
            }} />
            <div style={{
              position: "absolute", bottom: -40, left: -40,
              width: 120, height: 120, borderRadius: "50%",
              background: `${q.accentDeep}0a`, pointerEvents: "none",
            }} />

            {/* ── Tag + Step ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 99,
                background: `${q.accent}18`,
                border: `1px solid ${q.accent}40`,
              }}>
                <span style={{ fontSize: 12 }}>{q.emoji}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: q.accent,
                  letterSpacing: ".08em", textTransform: "uppercase",
                }}>{q.tag}</span>
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                {current + 1} <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span> {questions.length}
              </span>
            </div>

            {/* ── Progress bar ── */}
            <div style={{
              width: "100%", height: 4, borderRadius: 99,
              background: "rgba(255,255,255,0.07)", marginBottom: 22, overflow: "hidden",
            }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  height: "100%", borderRadius: 99,
                  background: `linear-gradient(90deg,${q.accentDeep},${q.accent})`,
                  boxShadow: `0 0 10px ${q.accent}80`,
                }}
              />
            </div>

            {/* ── Question ── */}
            <motion.h2
              key={`q-${current}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.06 }}
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: "clamp(20px,3.8vw,25px)",
                fontWeight: 700, color: "white",
                lineHeight: 1.3, marginBottom: 18,
                letterSpacing: "-0.02em",
              }}
            >
              {q.question}
            </motion.h2>

            {/* ── Options ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 22 }}>
              {q.options.map((opt, i) => (
                <OptionBtn
                  key={opt} label={opt}
                  selected={selected === opt}
                  onClick={() => setSelected(opt)}
                  accent={q.accent} accentDeep={q.accentDeep}
                  index={i}
                />
              ))}
            </div>

            {/* ── Footer ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={prev}
                disabled={current === 0}
                style={{
                  background: "none", border: "none",
                  cursor: current === 0 ? "default" : "pointer",
                  fontFamily: "inherit", fontSize: 13, fontWeight: 500,
                  color: current === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)",
                  padding: "8px 4px", transition: "color 0.2s",
                }}
              >← Back</button>

              {/* Step dots */}
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {questions.map((_, i) => (
                  <div key={i} style={{
                    height: 4, borderRadius: 99,
                    width: i === current ? 22 : 6,
                    background: i === current
                      ? `linear-gradient(90deg,${q.accentDeep},${q.accent})`
                      : i < current
                        ? `${q.accent}55`
                        : "rgba(255,255,255,0.1)",
                    transition: "all .35s cubic-bezier(.34,1.56,.64,1)",
                    boxShadow: i === current ? `0 0 8px ${q.accent}70` : "none",
                  }} />
                ))}
              </div>

              <motion.button
                whileHover={selected ? { scale: 1.05 } : {}}
                whileTap={selected ? { scale: 0.96 } : {}}
                onClick={next}
                style={{
                  padding: "11px 22px", borderRadius: 99, border: "none",
                  cursor: selected ? "pointer" : "not-allowed",
                  fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                  color: selected ? "white" : "rgba(255,255,255,0.18)",
                  background: selected
                    ? `linear-gradient(135deg,${q.accentDeep},${q.accent})`
                    : "rgba(255,255,255,0.06)",
                  boxShadow: selected ? `0 6px 22px ${q.accent}50` : "none",
                  transition: "all 0.25s ease",
                  letterSpacing: "0.01em",
                }}
              >
                {current === questions.length - 1 ? "See Results ✨" : "Next →"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ══ BOTTOM MINI STATUS BAR ══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: 16,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <div style={{
            padding: "6px 14px", borderRadius: 99,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: q.accent,
              boxShadow: `0 0 6px ${q.accent}`,
            }} />
            <span style={{
              fontSize: 11, fontWeight: 500,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: ".04em",
            }}>
              Question {current + 1} of {questions.length}
              {answeredCount > 0 && (
                <span style={{ color: q.accent, marginLeft: 6 }}>
                  · {answeredCount} answered
                </span>
              )}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}