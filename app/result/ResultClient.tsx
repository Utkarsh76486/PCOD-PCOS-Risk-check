"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

/* ══════════════════════════════════════
   TYPES
══════════════════════════════════════ */
interface Symptom {
  emoji: string;
  tag: string;
  answer: string;
  accent: string;
  accentDeep: string;
  severity: "low" | "medium" | "high";
}

/* ══════════════════════════════════════
   QUESTION META (mirrors questionnaire)
══════════════════════════════════════ */
const questionMeta = [
  {
    emoji: "🩸", tag: "Irregular Periods",
    accent: "#F472B6", accentDeep: "#BE185D",
    highAnswers: ["Yes"],
  },
  {
    emoji: "✨", tag: "Acne",
    accent: "#FB923C", accentDeep: "#C2410C",
    highAnswers: ["Frequently"], mediumAnswers: ["Sometimes"],
  },
  {
    emoji: "⚖️", tag: "Weight Gain",
    accent: "#A78BFA", accentDeep: "#6D28D9",
    highAnswers: ["Yes"],
  },
  {
    emoji: "🌿", tag: "Excess Hair Growth",
    accent: "#34D399", accentDeep: "#065F46",
    highAnswers: ["Yes"],
  },
  {
    emoji: "😴", tag: "Fatigue",
    accent: "#60A5FA", accentDeep: "#1D4ED8",
    highAnswers: ["Yes"],
  },
  {
    emoji: "💫", tag: "Mood Swings",
    accent: "#F9A8D4", accentDeep: "#9D174D",
    highAnswers: ["Frequently"], mediumAnswers: ["Sometimes"],
  },
];

/* ══════════════════════════════════════
   SCORE → RESULT CONFIG
══════════════════════════════════════ */
function getResultConfig(score: number, total: number) {
  const pct = (score / total) * 100;

  if (pct <= 30) return {
    level: "Low Risk",
    emoji: "🌸",
    headline: "You're Looking Good!",
    subtext: "Your responses suggest minimal PCOS indicators at this time.",
    advice: "Keep monitoring your health and maintain a balanced lifestyle.",
    bg: "linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 40%,#fefce8 100%)",
    accentA: "#34D399",
    accentB: "#059669",
    ring: "#34D39940",
    tier: 0,
  };
  if (pct <= 65) return {
    level: "Moderate Risk",
    emoji: "⚡",
    headline: "Worth Paying Attention To",
    subtext: "Some symptoms you've reported may warrant a closer look.",
    advice: "We recommend speaking with a gynaecologist for a proper evaluation.",
    bg: "linear-gradient(135deg,#fffbeb 0%,#fff7ed 40%,#fef2f2 100%)",
    accentA: "#FBBF24",
    accentB: "#D97706",
    ring: "#FBBF2440",
    tier: 1,
  };
  return {
    level: "High Risk",
    emoji: "🔴",
    headline: "Please Consult a Doctor",
    subtext: "Several symptoms you've described are commonly associated with PCOS.",
    advice: "Please schedule an appointment with a gynaecologist or endocrinologist soon.",
    bg: "linear-gradient(135deg,#fef2f2 0%,#fff1f2 40%,#fdf4ff 100%)",
    accentA: "#F87171",
    accentB: "#DC2626",
    ring: "#F8717140",
    tier: 2,
  };
}

/* ══════════════════════════════════════
   ANIMATED SCORE RING
══════════════════════════════════════ */
function ScoreRing({ score, total, accentA, accentB, ring }: {
  score: number; total: number;
  accentA: string; accentB: string; ring: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const pct = Math.round((score / total) * 100);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / total) * circ;

  useEffect(() => {
    let frame = 0;
    const target = pct;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(ease * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pct]);

  return (
    <div style={{ position:"relative", width:140, height:140 }}>
      {/* Glow ring */}
      <div style={{
        position:"absolute", inset:-10,
        borderRadius:"50%",
        background: `radial-gradient(circle,${ring} 0%,transparent 70%)`,
        animation: "pulse 2.4s ease-in-out infinite",
      }}/>
      <svg width={140} height={140} viewBox="0 0 140 140" style={{ transform:"rotate(-90deg)" }}>
        <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={10}/>
        <motion.circle
          cx={70} cy={70} r={r} fill="none"
          stroke={`url(#ringGrad)`}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.4, ease: [0.22,1,0.36,1], delay: 0.3 }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentB}/>
            <stop offset="100%" stopColor={accentA}/>
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
      }}>
        <span style={{
          fontSize:34, fontWeight:700,
          fontFamily:"'Fraunces',serif",
          color:"#111827", lineHeight:1,
        }}>{displayed}</span>
        <span style={{
          fontSize:11, fontWeight:600,
          color:"#6B7280", letterSpacing:".07em",
          textTransform:"uppercase", marginTop:2,
        }}>of {total}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SYMPTOM CHIP
══════════════════════════════════════ */
function SymptomChip({ s, index }: { s: Symptom; index: number }) {
  const severityLabel =
    s.severity === "high" ? "Noted" :
    s.severity === "medium" ? "Mild" : "Clear";

  const severityBg =
    s.severity === "high" ? `${s.accent}22` :
    s.severity === "medium" ? `${s.accent}12` : "rgba(0,0,0,0.04)";

  const severityColor =
    s.severity === "high" ? s.accentDeep :
    s.severity === "medium" ? s.accent : "#9CA3AF";

  return (
    <motion.div
      initial={{ opacity:0, y:14, scale:0.95 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ delay: 0.6 + index * 0.07, duration:0.4, ease:[0.22,1,0.36,1] }}
      style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"13px 16px", borderRadius:16,
        background: s.severity === "high"
          ? `linear-gradient(135deg,${s.accentDeep}0e,${s.accent}18)`
          : "rgba(255,255,255,0.7)",
        border: s.severity === "high"
          ? `1.5px solid ${s.accent}50`
          : "1.5px solid rgba(255,255,255,0.8)",
        backdropFilter:"blur(10px)",
        boxShadow: s.severity === "high"
          ? `0 4px 20px ${s.accent}28`
          : "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{
          width:36, height:36, borderRadius:12,
          background: `linear-gradient(135deg,${s.accentDeep}22,${s.accent}30)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:16, flexShrink:0,
        }}>{s.emoji}</div>
        <div>
          <div style={{
            fontSize:13, fontWeight:600, color:"#111827",
            fontFamily:"'DM Sans',sans-serif", letterSpacing:"-0.01em",
          }}>{s.tag}</div>
          <div style={{ fontSize:11, color:"#9CA3AF", marginTop:1 }}>
            Your answer: <span style={{ color: s.accentDeep, fontWeight:600 }}>{s.answer}</span>
          </div>
        </div>
      </div>
      <div style={{
        padding:"4px 10px", borderRadius:99,
        background: severityBg,
        fontSize:11, fontWeight:700,
        color: severityColor,
        letterSpacing:".05em", textTransform:"uppercase",
      }}>
        {severityLabel}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   DISCLAIMER CARD
══════════════════════════════════════ */
function DisclaimerCard({ accentA }: { accentA: string }) {
  return (
    <motion.div
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:1.2, duration:0.4 }}
      style={{
        padding:"14px 16px", borderRadius:16,
        background:"rgba(255,255,255,0.6)",
        backdropFilter:"blur(12px)",
        border:"1px solid rgba(0,0,0,0.07)",
        display:"flex", gap:12, alignItems:"flex-start",
      }}
    >
      <div style={{
        width:32, height:32, borderRadius:10, flexShrink:0,
        background:`${accentA}20`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:15,
      }}>🩺</div>
      <p style={{
        fontSize:12.5, color:"#6B7280", lineHeight:1.6,
        fontFamily:"'DM Sans',sans-serif",
      }}>
        <strong style={{ color:"#374151" }}>Medical Disclaimer: </strong>
        This is a preliminary self-assessment tool, not a medical diagnosis.
        Always consult a qualified healthcare professional for accurate diagnosis and treatment.
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   MAIN RESULT PAGE
══════════════════════════════════════ */
export default function ResultClient() {
  const [answers, setAnswers] = useState<string[]>([
    "Yes","Sometimes","Yes","Yes","Yes","Sometimes"
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("data");
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw));
        if (Array.isArray(parsed)) setAnswers(parsed);
      }
    } catch { /* use defaults */ }
    setMounted(true);
  }, []);

  // Build symptom list
  const symptoms: Symptom[] = questionMeta.map((meta, i) => {
    const answer = answers[i] || "No";
    const isHigh = (meta.highAnswers || []).includes(answer);
    const isMedium = (meta.mediumAnswers || []).includes(answer);
    return {
      emoji: meta.emoji,
      tag: meta.tag,
      answer,
      accent: meta.accent,
      accentDeep: meta.accentDeep,
      severity: isHigh ? "high" : isMedium ? "medium" : "low",
    };
  });

  const score = symptoms.filter(s => s.severity === "high").length
    + symptoms.filter(s => s.severity === "medium").length * 0.5;
  const roundedScore = Math.round(score);
  const total = questionMeta.length;
  const config = getResultConfig(score, total);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight:"100vh",
      background: config.bg,
      fontFamily:"'DM Sans',sans-serif",
      position:"relative",
      overflowX:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes pulse {
          0%,100% { opacity:0.5; transform:scale(1); }
          50%      { opacity:0.9; transform:scale(1.08); }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-8px); }
        }
        @keyframes blobDrift {
          0%,100%{transform:scale(1) rotate(0deg);opacity:0.4}
          50%    {transform:scale(1.06) rotate(8deg);opacity:0.6}
        }
        .blob { animation: blobDrift 9s ease-in-out infinite; }
        .float { animation: float 3.5s ease-in-out infinite; }
      `}</style>

      {/* ── Decorative blobs ── */}
      <div className="blob" style={{
        position:"fixed", top:"-10%", right:"-10%",
        width:"45vw", height:"45vw", maxWidth:480,
        borderRadius:"50%",
        background:`radial-gradient(circle,${config.accentA}28 0%,transparent 70%)`,
        filter:"blur(60px)", pointerEvents:"none", zIndex:0,
        transition:"background 0.7s",
      }}/>
      <div style={{
        position:"fixed", bottom:"-10%", left:"-8%",
        width:"38vw", height:"38vw", maxWidth:400,
        borderRadius:"50%",
        background:`radial-gradient(circle,${config.accentB}1a 0%,transparent 70%)`,
        filter:"blur(60px)", pointerEvents:"none", zIndex:0,
      }}/>

      {/* ── Content ── */}
      <div style={{
        position:"relative", zIndex:1,
        maxWidth:500, margin:"0 auto",
        padding:"32px 16px 48px",
        display:"flex", flexDirection:"column", gap:20,
      }}>

        {/* ── HERO CARD ── */}
        <motion.div
          initial={{ opacity:0, y:30, scale:0.95 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
          style={{
            borderRadius:28,
            background:"rgba(255,255,255,0.88)",
            backdropFilter:"blur(32px) saturate(200%)",
            WebkitBackdropFilter:"blur(32px) saturate(200%)",
            border:"1px solid rgba(255,255,255,0.95)",
            boxShadow:`0 24px 64px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)`,
            overflow:"hidden",
            position:"relative",
          }}
        >
          {/* Top gradient bar */}
          <div style={{
            height:4,
            background:`linear-gradient(90deg,${config.accentB},${config.accentA},${config.accentB})`,
          }}/>

          {/* Corner bloom */}
          <div style={{
            position:"absolute", top:-50, right:-50,
            width:160, height:160, borderRadius:"50%",
            background:`${config.accentA}18`, pointerEvents:"none",
          }}/>
          <div style={{
            position:"absolute", bottom:-40, left:-40,
            width:120, height:120, borderRadius:"50%",
            background:`${config.accentB}10`, pointerEvents:"none",
          }}/>

          <div style={{ padding:"28px 24px 28px" }}>
            {/* Tag line */}
            <motion.div
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.15 }}
              style={{
                display:"inline-flex", alignItems:"center", gap:6,
                padding:"5px 12px", borderRadius:99,
                background:`${config.accentA}1a`,
                border:`1px solid ${config.accentA}40`,
                marginBottom:20,
              }}
            >
              <span style={{ fontSize:11 }}>🩺</span>
              <span style={{
                fontSize:11, fontWeight:700,
                color:config.accentB, letterSpacing:".07em",
                textTransform:"uppercase",
              }}>PCOS Symptom Assessment</span>
            </motion.div>

            {/* Score + level row */}
            <div style={{
              display:"flex", alignItems:"center",
              justifyContent:"space-between", flexWrap:"wrap", gap:20,
            }}>
              {/* Left: text */}
              <div style={{ flex:1, minWidth:160 }}>
                <motion.div
                  className="float"
                  style={{ fontSize:36, lineHeight:1, marginBottom:10 }}
                >
                  {config.emoji}
                </motion.div>
                <motion.h1
                  initial={{ opacity:0, x:-10 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay:0.25, duration:0.4 }}
                  style={{
                    fontFamily:"'Fraunces',serif",
                    fontSize:"clamp(22px,4vw,28px)",
                    fontWeight:700, color:"#111827",
                    lineHeight:1.25, letterSpacing:"-0.02em",
                    marginBottom:8,
                  }}
                >
                  {config.headline}
                </motion.h1>
                <motion.div
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  transition={{ delay:0.35 }}
                  style={{
                    display:"inline-flex",
                    alignItems:"center", gap:6,
                    padding:"6px 14px", borderRadius:99,
                    background:`linear-gradient(135deg,${config.accentB}22,${config.accentA}28)`,
                    border:`1.5px solid ${config.accentA}50`,
                  }}
                >
                  <span style={{
                    fontSize:13, fontWeight:700,
                    color:config.accentB, letterSpacing:".03em",
                  }}>{config.level}</span>
                </motion.div>
              </div>

              {/* Right: score ring */}
              <motion.div
                initial={{ opacity:0, scale:0.7 }}
                animate={{ opacity:1, scale:1 }}
                transition={{ delay:0.3, duration:0.5, ease:[0.22,1,0.36,1] }}
              >
                <ScoreRing
                  score={roundedScore}
                  total={total}
                  accentA={config.accentA}
                  accentB={config.accentB}
                  ring={config.ring}
                />
              </motion.div>
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:0.45 }}
              style={{
                fontSize:14, color:"#4B5563", lineHeight:1.6,
                marginTop:20, paddingTop:20,
                borderTop:"1px solid rgba(0,0,0,0.07)",
              }}
            >
              {config.subtext}
            </motion.p>

            {/* Advice banner */}
            <motion.div
              initial={{ opacity:0, y:6 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.55 }}
              style={{
                marginTop:14, padding:"12px 14px",
                borderRadius:14,
                background:`linear-gradient(135deg,${config.accentB}0f,${config.accentA}18)`,
                border:`1px solid ${config.accentA}35`,
                display:"flex", gap:10, alignItems:"flex-start",
              }}
            >
              <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
              <p style={{ fontSize:13, color:config.accentB, fontWeight:500, lineHeight:1.55 }}>
                {config.advice}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── SYMPTOM BREAKDOWN CARD ── */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.45, duration:0.45 }}
          style={{
            borderRadius:28,
            background:"rgba(255,255,255,0.82)",
            backdropFilter:"blur(24px)",
            WebkitBackdropFilter:"blur(24px)",
            border:"1px solid rgba(255,255,255,0.95)",
            boxShadow:"0 12px 40px rgba(0,0,0,0.08)",
            padding:"24px 20px",
          }}
        >
          <div style={{
            display:"flex", alignItems:"center",
            justifyContent:"space-between", marginBottom:18,
          }}>
            <h2 style={{
              fontFamily:"'Fraunces',serif",
              fontSize:18, fontWeight:700,
              color:"#111827", letterSpacing:"-0.02em",
            }}>Symptom Breakdown</h2>
            <div style={{
              padding:"4px 10px", borderRadius:99,
              background:"rgba(0,0,0,0.05)",
              fontSize:11, fontWeight:600,
              color:"#6B7280", letterSpacing:".05em",
              textTransform:"uppercase",
            }}>
              {symptoms.filter(s=>s.severity!=="low").length} flagged
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {symptoms.map((s,i) => (
              <SymptomChip key={i} s={s} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── WHAT NEXT CARD ── */}
        <motion.div
          initial={{ opacity:0, y:20}}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.55, duration:0.45 }}
          style={{
            borderRadius:28,
            background:"rgba(255,255,255,0.82)",
            backdropFilter:"blur(24px)",
            WebkitBackdropFilter:"blur(24px)",
            border:"1px solid rgba(255,255,255,0.95)",
            boxShadow:"0 12px 40px rgba(0,0,0,0.08)",
            padding:"24px 20px",
          }}
        >
          <h2 style={{
            fontFamily:"'Fraunces',serif",
            fontSize:18, fontWeight:700,
            color:"#111827", letterSpacing:"-0.02em",
            marginBottom:16,
          }}>Next Steps</h2>

          {[
            { icon:"🩸", title:"Get Blood Tests", desc:"Hormonal panels — LH, FSH, testosterone, insulin, thyroid." },
            { icon:"📅", title:"Track Your Cycle", desc:"Use a period tracking app for 2–3 months." },
            { icon:"🥗", title:"Lifestyle Adjustments", desc:"Anti-inflammatory diet and regular movement help manage symptoms." },
            { icon:"👩‍⚕️", title:"Consult a Specialist", desc:"A gynaecologist can confirm PCOS via ultrasound and bloodwork." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, x:-8 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              style={{
                display:"flex", gap:12, alignItems:"flex-start",
                paddingBottom: i < 3 ? 14 : 0,
                marginBottom: i < 3 ? 14 : 0,
                borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.06)" : "none",
              }}
            >
              <div style={{
                width:38, height:38, borderRadius:12,
                background:`${config.accentA}1a`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:17, flexShrink:0,
              }}>{item.icon}</div>
              <div>
                <div style={{
                  fontSize:14, fontWeight:600, color:"#111827",
                  marginBottom:2, letterSpacing:"-0.01em",
                }}>{item.title}</div>
                <div style={{ fontSize:12.5, color:"#6B7280", lineHeight:1.5 }}>
                  {item.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── DISCLAIMER ── */}
        <DisclaimerCard accentA={config.accentA} />

        {/* ── RETAKE BUTTON ── */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:1.3 }}
          style={{ display:"flex", justifyContent:"center" }}
        >
          <motion.a
            href="/"
            whileHover={{ scale:1.04 }}
            whileTap={{ scale:0.97 }}
            style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"13px 28px", borderRadius:99,
              background:`linear-gradient(135deg,${config.accentB},${config.accentA})`,
              boxShadow:`0 8px 24px ${config.accentA}55`,
              color:"white", fontSize:14, fontWeight:600,
              fontFamily:"'DM Sans',sans-serif",
              letterSpacing:"0.01em", textDecoration:"none",
              border:"none", cursor:"pointer",
            }}
          >
            ← Retake Assessment
          </motion.a>
        </motion.div>

      </div>
    </div>
  );
}