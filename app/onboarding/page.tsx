"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
function CycleVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "8px 0" }}>
      <div style={{ position: "relative", width: 150, height: 150 }}>
        <svg width="150" height="150" viewBox="0 0 150 150" style={{ position: "absolute", top: 0, left: 0 }}>
          <circle cx="75" cy="75" r="60" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
          <circle cx="75" cy="75" r="60" fill="none"
            stroke="url(#cycleGrad)" strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="251" strokeDashoffset="63"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center", filter: "drop-shadow(0 0 8px #F472B6)" }}
          />
          <defs>
            <linearGradient id="cycleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ fontSize: 32 }}>🌸</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Day 14</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["Follicular", "Ovulation", "Luteal"].map((phase, i) => (
          <div key={i} style={{
            padding: "5px 10px", borderRadius: 99, fontSize: 11,
            background: i === 1 ? "linear-gradient(135deg,#F472B6,#A855F7)" : "rgba(255,255,255,0.07)",
            border: i === 1 ? "none" : "1px solid rgba(255,255,255,0.12)",
            color: i === 1 ? "white" : "rgba(255,255,255,0.45)",
            fontWeight: i === 1 ? 600 : 400,
          }}>{phase}</div>
        ))}
      </div>
    </div>
  );
}

function CareVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }}>
      {[
        { label: "Anti-inflammatory Diet", pct: 82, color: "#F472B6" },
        { label: "Sleep Quality", pct: 68, color: "#C084FC" },
        { label: "Stress Management", pct: 74, color: "#A78BFA" },
      ].map((item, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{item.label}</span>
            <span style={{ fontSize: 12, color: item.color, fontWeight: 600 }}>{item.pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.07)" }}>
            <div style={{
              height: "100%", borderRadius: 99, width: `${item.pct}%`,
              background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
              boxShadow: `0 0 10px ${item.color}66`,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HabitVisual() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "4px 0" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {days.map((d, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: i < 5 ? "linear-gradient(135deg,#FB923C,#EC4899)" : "rgba(255,255,255,0.06)",
              border: i < 5 ? "none" : "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: i < 5 ? 15 : 13,
              color: i < 5 ? "white" : "rgba(255,255,255,0.25)",
              boxShadow: i < 5 ? "0 4px 14px #FB923C55" : "none",
            }}>
              {i < 5 ? "✓" : "·"}
            </div>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{d}</span>
          </div>
        ))}
      </div>
      <div style={{
        padding: "8px 18px", borderRadius: 12,
        background: "linear-gradient(135deg,rgba(251,146,60,0.15),rgba(236,72,153,0.15))",
        border: "1px solid rgba(251,146,60,0.25)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 18 }}>🔥</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
          5 day streak — keep going!
        </span>
      </div>
    </div>
  );
}

const slides = [
  {
    id: 0,
    title: "Track Your Health",
    subtitle: "Monitor your PCOD symptoms easily & stay in control of your body.",
    accent: "#F472B6",
    accentDark: "#BE185D",
    bgImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
    visual: <CycleVisual />,
  },
  {
    id: 1,
    title: "Personalized Care",
    subtitle: "Get AI-powered lifestyle tips tailored to your unique body & cycle phase.",
    accent: "#C084FC",
    accentDark: "#7E22CE",
    bgImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
    visual: <CareVisual />,
  },
  {
    id: 2,
    title: "Stay Consistent",
    subtitle: "Build healthy habits with daily reminders & streak tracking for a better life.",
    accent: "#FB923C",
    accentDark: "#C2410C",
    bgImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
    visual: <HabitVisual />,
  },
];

export default function PCODOnboarding() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const slide = slides[current];

  const goTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= slides.length) return;
    setAnimKey((k) => k + 1);
    setCurrent(nextIndex);
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      fontFamily: "'DM Sans', sans-serif",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes bgFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.5; transform: scale(0.8); }
        }

        .bg-slide    { animation: bgFade  0.7s ease both; }
        .card-slide  { animation: cardIn  0.45s cubic-bezier(0.22,1,0.36,1) both; }

        .dot-btn { border: none; cursor: pointer; padding: 0; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); }

        .btn-back {
          flex: 1;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer; color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          border-radius: 14px; padding: 15px 0;
          transition: background 0.2s;
        }
        .btn-back:hover { background: rgba(255,255,255,0.14); }

        .btn-skip {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.35);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; letter-spacing: 0.05em;
          transition: color 0.2s;
        }
        .btn-skip:hover { color: rgba(255,255,255,0.75); }
      `}</style>

      {/* ── Background Image ── */}
      <div
        key={`bg-${current}`}
        className="bg-slide"
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${slide.bgImage})`,
          backgroundSize: "cover", backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* ── Gradient overlays ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.82) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: `radial-gradient(ellipse at 50% 110%, ${slide.accent}28 0%, transparent 65%)`,
        transition: "background 0.8s ease",
      }} />

      {/* ── Page center ── */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
      }}>

        {/* ── Card ── */}
        <div
          key={`card-${animKey}`}
          className="card-slide"
          style={{
            position: "relative",
            width: "100%", maxWidth: 440,
            borderRadius: 28,
            background:  "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(52px)",
            padding: "28px 24px 24px",
            boxShadow: `0 40px 100px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)`,
            overflow: "hidden",
          }}
        >

          {/* Top accent line */}
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
            background: `linear-gradient(90deg, transparent, ${slide.accent}cc, transparent)`,
          }} />

          {/* ── Header ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "5px 12px 5px 8px",
              borderRadius: 99,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: slide.accent,
                boxShadow: `0 0 7px ${slide.accent}`,
                animation: "pulse 2s ease infinite",
              }} />
              <span style={{
                fontSize: 11, letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}>
                PCOD Care · {current + 1} of {slides.length}
              </span>
            </div>
            <button className="btn-skip">Skip</button>
          </div>

          {/* ── Title ── */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(24px,5vw,30px)",
            fontWeight: 700, color: "#fff",
            lineHeight: 1.2, marginBottom: 10,
            letterSpacing: "-0.02em",
          }}>
            {slide.title}
          </h1>

          {/* ── Subtitle ── */}
          <p style={{
            fontSize: 14, lineHeight: 1.7,
            color: "rgba(255,255,255,0.46)",
            marginBottom: 22,
          }}>
            {slide.subtitle}
          </p>

          {/* ── Visual box ── */}
          <div style={{
            borderRadius: 18,
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "18px 16px",
            marginBottom: 22,
          }}>
            {slide.visual}
          </div>

          {/* ── Progress dots ── */}
          <div style={{ display: "flex", justifyContent: "center", gap: 7, marginBottom: 22 }}>
            {slides.map((_, i) => (
              <button
                key={i}
                className="dot-btn"
                onClick={() => goTo(i)}
                style={{
                  height: 5, borderRadius: 99,
                  width: i === current ? 30 : 8,
                  background: i === current
                    ? `linear-gradient(90deg, ${slide.accent}, ${slide.accentDark})`
                    : "rgba(255,255,255,0.14)",
                  boxShadow: i === current ? `0 0 10px ${slide.accent}88` : "none",
                }}
              />
            ))}
          </div>

          {/* ── Buttons ── */}
          <div style={{ display: "flex", gap: 10 }}>
            {current > 0 && (
              <button className="btn-back" onClick={() => goTo(current - 1)}>
                ← Back
              </button>
            )}

            <button
              onClick={() => {
                if (current < slides.length - 1) goTo(current + 1);
                // else: navigate to your home/dashboard
              }}
              style={{
                flex: current > 0 ? 2 : 1,
                padding: "15px 0", borderRadius: 14,
                background: `linear-gradient(135deg, ${slide.accent}, ${slide.accentDark})`,
                backgroundSize: "200% auto",
                animation: "shimmer 3s linear infinite",
                border: "none", cursor: "pointer",
                color: "#fff", fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, fontWeight: 600,
                letterSpacing: "0.02em",
                boxShadow: `0 6px 28px ${slide.accent}55`,
                transition: "transform 0.18s, box-shadow 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {current === slides.length - 1 ? "Get Started ✨" : "Next →"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}