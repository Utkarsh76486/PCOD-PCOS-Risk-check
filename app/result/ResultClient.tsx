"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const questionMeta = [
  { emoji: "🩸", tag: "Irregular Periods", accent: "#F472B6", accentDeep: "#BE185D", highAnswers: ["Yes"] },
  { emoji: "✨", tag: "Acne", accent: "#FB923C", accentDeep: "#C2410C", highAnswers: ["Frequently"], mediumAnswers: ["Sometimes"] },
  { emoji: "⚖️", tag: "Weight Gain", accent: "#A78BFA", accentDeep: "#6D28D9", highAnswers: ["Yes"] },
  { emoji: "🌿", tag: "Excess Hair", accent: "#34D399", accentDeep: "#065F46", highAnswers: ["Yes"] },
  { emoji: "😴", tag: "Fatigue", accent: "#60A5FA", accentDeep: "#1D4ED8", highAnswers: ["Yes"] },
  { emoji: "💫", tag: "Mood Swings", accent: "#F9A8D4", accentDeep: "#9D174D", highAnswers: ["Frequently"], mediumAnswers: ["Sometimes"] },
];

function getConfig(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct <= 30) return {
    level: "Low Risk", emoji: "🌸", headline: "You're Looking Good!",
    subtext: "Minimal PCOS indicators detected. Keep monitoring your health.",
    accentA: "#34D399", accentB: "#059669",
    meshA: "#34D39930", meshB: "#6EE7B730", meshC: "#A7F3D020",
  };
  if (pct <= 65) return {
    level: "Moderate Risk", emoji: "⚡", headline: "Worth Paying Attention To",
    subtext: "Some symptoms may warrant a closer look. Consult a gynaecologist.",
    accentA: "#FBBF24", accentB: "#D97706",
    meshA: "#FBBF2430", meshB: "#FDE68A30", meshC: "#FEF3C720",
  };
  return {
    level: "High Risk", emoji: "🔴", headline: "Please Consult a Doctor",
    subtext: "Several PCOS symptoms detected. Schedule an appointment soon.",
    accentA: "#F87171", accentB: "#DC2626",
    meshA: "#F8717130", meshB: "#FCA5A530", meshC: "#FEE2E220",
  };
}

function ScoreRing({ score, total, accentA, accentB }: { score: number; total: number; accentA: string; accentB: string }) {
  const [displayed, setDisplayed] = useState(0);
  const pct = Math.round((score / total) * 100);
  const r = 44;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(ease * pct));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [pct]);

  return (
    <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: -8, borderRadius: "50%",
        background: `radial-gradient(circle,${accentA}35 0%,transparent 70%)`,
        animation: "pulse 2.5s ease-in-out infinite",
      }} />
      <svg width={110} height={110} viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={55} cy={55} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={9} />
        <motion.circle
          cx={55} cy={55} r={r} fill="none"
          stroke="url(#rg)" strokeWidth={9} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (score / total) * circ }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        />
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentB} />
            <stop offset="100%" stopColor={accentA} />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Fraunces',serif", color: "white", lineHeight: 1 }}>{displayed}</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginTop: 2 }}>of {total}</span>
      </div>
    </div>
  );
}

export default function ResultClient() {
  const [answers, setAnswers] = useState<string[]>(["Yes", "Sometimes", "Yes", "Yes", "Yes", "Sometimes"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = new URLSearchParams(window.location.search).get("data");
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw));
        if (Array.isArray(parsed)) setAnswers(parsed);
      }
    } catch { /* defaults */ }
    setMounted(true);
  }, []);

  const symptoms = questionMeta.map((meta, i) => {
    const answer = answers[i] || "No";
    const isHigh = (meta.highAnswers || []).includes(answer);
    const isMedium = ((meta as any).mediumAnswers || []).includes(answer);
    return { ...meta, answer, severity: isHigh ? "high" : isMedium ? "medium" : "low" as "high" | "medium" | "low" };
  });

  const score = symptoms.reduce((acc, s) => acc + (s.severity === "high" ? 1 : s.severity === "medium" ? 0.5 : 0), 0);
  const roundedScore = Math.round(score);
  const total = questionMeta.length;
  const cfg = getConfig(score, total);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh", maxHeight: "100vh",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.9;transform:scale(1.08)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes meshMove { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.08)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes meshMove2 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,30px) scale(1.06)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes meshMove3 { 0%{transform:translate(0,0)} 50%{transform:translate(20px,20px)} 100%{transform:translate(0,0)} }
        @keyframes gridFade { from{opacity:0} to{opacity:1} }
        .float { animation: float 3.5s ease-in-out infinite; }
      `}</style>

      {/* ══ PREMIUM DARK BACKGROUND ══ */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "linear-gradient(135deg,#0a0a14 0%,#0f0b1e 35%,#130d1a 65%,#0c0e18 100%)",
      }} />

      {/* Animated mesh blobs */}
      <div style={{
        position: "fixed", top: "-20%", left: "-10%",
        width: "60vw", height: "60vw", maxWidth: 700,
        borderRadius: "50%",
        background: `radial-gradient(circle,${cfg.meshA} 0%,transparent 65%)`,
        filter: "blur(70px)", pointerEvents: "none", zIndex: 1,
        animation: "meshMove 12s ease-in-out infinite",
      }} />
      <div style={{
        position: "fixed", bottom: "-15%", right: "-10%",
        width: "55vw", height: "55vw", maxWidth: 650,
        borderRadius: "50%",
        background: `radial-gradient(circle,${cfg.meshB} 0%,transparent 65%)`,
        filter: "blur(70px)", pointerEvents: "none", zIndex: 1,
        animation: "meshMove2 14s ease-in-out infinite",
      }} />
      <div style={{
        position: "fixed", top: "40%", left: "40%",
        width: "40vw", height: "40vw", maxWidth: 500,
        borderRadius: "50%",
        background: `radial-gradient(circle,${cfg.meshC} 0%,transparent 70%)`,
        filter: "blur(80px)", pointerEvents: "none", zIndex: 1,
        animation: "meshMove3 10s ease-in-out infinite",
      }} />

      {/* Subtle grid overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),
                          linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)`,
        backgroundSize: "44px 44px",
        opacity: 0.6,
      }} />

      {/* Noise texture */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "128px 128px",
      }} />

      {/* ══ MAIN CARD ══ */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: 480,
          margin: "0 16px",
          borderRadius: 28,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.12)`,
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg,transparent,${cfg.accentB},${cfg.accentA},${cfg.accentB},transparent)`,
        }} />

        <div style={{ padding: "24px 24px 22px" }}>

          {/* ── Header row: tag + step ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 99,
              background: `${cfg.accentA}18`,
              border: `1px solid ${cfg.accentA}40`,
            }}>
              <span style={{ fontSize: 11 }}>🩺</span>
              <span style={{
                fontSize: 10, fontWeight: 700, color: cfg.accentA,
                letterSpacing: ".08em", textTransform: "uppercase",
              }}>PCOS Assessment</span>
            </div>
            <div style={{
              padding: "5px 12px", borderRadius: 99,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)",
            }}>Results</div>
          </motion.div>

          {/* ── Hero: ring + headline ── */}
          <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20 }}>
            <ScoreRing score={roundedScore} total={total} accentA={cfg.accentA} accentB={cfg.accentB} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <motion.div
                className="float"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: 28, lineHeight: 1, marginBottom: 8 }}
              >{cfg.emoji}</motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 }}
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontSize: "clamp(18px,3.5vw,22px)",
                  fontWeight: 700, color: "white",
                  lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 8,
                }}
              >{cfg.headline}</motion.h1>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 12px", borderRadius: 99,
                  background: `linear-gradient(135deg,${cfg.accentB}30,${cfg.accentA}38)`,
                  border: `1.5px solid ${cfg.accentA}50`,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.accentA, boxShadow: `0 0 6px ${cfg.accentA}` }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: cfg.accentA, letterSpacing: ".03em" }}>{cfg.level}</span>
              </motion.div>
            </div>
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6,
              marginBottom: 20, paddingBottom: 20,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >{cfg.subtext}</motion.p>

          {/* ── Symptom chips grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
            {symptoms.map((s, i) => {
              const isHigh = s.severity === "high";
              const isMed = s.severity === "medium";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    borderRadius: 14,
                    padding: "10px 10px 9px",
                    background: isHigh
                      ? `linear-gradient(135deg,${s.accentDeep}28,${s.accent}22)`
                      : "rgba(255,255,255,0.05)",
                    border: isHigh
                      ? `1px solid ${s.accent}45`
                      : isMed
                        ? `1px solid ${s.accent}28`
                        : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: isHigh ? `0 4px 16px ${s.accent}20` : "none",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{s.emoji}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: isHigh ? s.accent : "rgba(255,255,255,0.45)",
                    lineHeight: 1.3, letterSpacing: ".01em",
                  }}>{s.tag}</span>
                  <div style={{
                    padding: "2px 7px", borderRadius: 99,
                    background: isHigh ? `${s.accent}22` : "rgba(255,255,255,0.06)",
                    fontSize: 9, fontWeight: 700,
                    color: isHigh ? s.accent : isMed ? s.accent + "aa" : "rgba(255,255,255,0.3)",
                    letterSpacing: ".06em", textTransform: "uppercase",
                  }}>
                    {isHigh ? "Noted" : isMed ? "Mild" : "Clear"}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Disclaimer + Retake row ── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: 12,
              paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.5, flex: 1 }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Disclaimer:</span> Not a medical diagnosis. Consult a doctor.
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 18px", borderRadius: 99,
                background: `linear-gradient(135deg,${cfg.accentB},${cfg.accentA})`,
                boxShadow: `0 6px 20px ${cfg.accentA}45`,
                color: "white", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.01em", textDecoration: "none",
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >← Retake</motion.a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}