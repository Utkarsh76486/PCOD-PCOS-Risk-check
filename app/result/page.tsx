"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ══════════════════════════════════════
   SCORING LOGIC
══════════════════════════════════════ */
function computeResult(answers: string[]) {
  // answers[0]=periods, [1]=acne, [2]=weight, [3]=hair, [4]=tired, [5]=mood
  let score = 100;

  const penalties: Record<string, number> = {
    // Periods
    "Yes_0": 20,
    // Acne
    "Sometimes_1": 8, "Frequently_1": 18,
    // Weight
    "Yes_2": 15,
    // Hair
    "Yes_3": 12,
    // Tired
    "Yes_4": 10,
    // Mood
    "Sometimes_5": 6, "Frequently_5": 14,
  };

  answers.forEach((ans, i) => {
    const key = `${ans}_${i}`;
    if (penalties[key]) score -= penalties[key];
  });

  score = Math.max(10, Math.min(100, score));

  const risk = score >= 75 ? "Low" : score >= 50 ? "Moderate" : "High";
  const riskColor = score >= 75 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444";

  // Per-category status
  const cycle     = answers[0] === "Yes"         ? { label:"Irregular", status:"Alert",  color:"#EF4444" } : { label:"Regular",    status:"Good",   color:"#22C55E" };
  const hormones  = answers[0] === "Yes"         ? { label:"Disrupted", status:"Alert",  color:"#EF4444" } : { label:"Stable",     status:"Good",   color:"22C55E" };
  const lifestyle = (answers[2]==="Yes"||answers[4]==="Yes") ? { label:"Needs Work", status:"Alert", color:"#F59E0B" } : { label:"Healthy", status:"Good", color:"#22C55E" };
  const acneStat  = answers[1] === "Frequently"  ? { label:"Frequent",  status:"Alert",  color:"#EF4444" }
                  : answers[1] === "Sometimes"   ? { label:"Sometimes", status:"Watch",  color:"#F59E0B" }
                  : { label:"Rarely", status:"Good", color:"#22C55E" };
  const weight    = answers[2] === "Yes"         ? { label:"Elevated",  status:"Alert",  color:"#EF4444" } : { label:"Stable",     status:"Good",   color:"#22C55E" };
  const hair      = answers[3] === "Yes"         ? { label:"Excessive", status:"Alert",  color:"#EF4444" } : { label:"Normal",     status:"Good",   color:"#22C55E" };
  const energy    = answers[4] === "Yes"         ? { label:"Low",       status:"Alert",  color:"#EF4444" } : { label:"Good",       status:"Good",   color:"#22C55E" };
  const mood      = answers[5] === "Frequently"  ? { label:"Frequent",  status:"Alert",  color:"#EF4444" }
                  : answers[5] === "Sometimes"   ? { label:"Sometimes", status:"Watch",  color:"#F59E0B" }
                  : { label:"Stable", status:"Good", color:"#22C55E" };

  return { score, risk, riskColor, cycle, hormones, lifestyle, acneStat, weight, hair, energy, mood };
}

/* ══════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════ */
function Badge({ status, color }: { status: string; color: string }) {
  const bg =
    status === "Good"  ? "rgba(34,197,94,0.12)"  :
    status === "Watch" ? "rgba(245,158,11,0.12)" :
                         "rgba(239,68,68,0.12)";
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600,
      background:bg, color, border:`1px solid ${color}33`,
      letterSpacing:"0.04em",
    }}>
      <span style={{width:5,height:5,borderRadius:"50%",background:color,display:"inline-block"}}/>
      {status}
    </span>
  );
}

/* ══════════════════════════════════════
   METRIC CARD
══════════════════════════════════════ */
function MetricCard({
  icon, title, value, stat, delay,
}: {
  icon:string; title:string; value:string;
  stat:{label:string;status:string;color:string}; delay:number;
}) {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0  }}
      transition={{ delay, duration:0.4, ease:[0.22,1,0.36,1] }}
      style={{
        padding:"18px 16px",
        borderRadius:20,
        background:"rgba(255,255,255,0.7)",
        border:"1px solid rgba(255,255,255,0.9)",
        backdropFilter:"blur(16px)",
        boxShadow:"0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
        display:"flex", flexDirection:"column", gap:8,
      }}
    >
      <div style={{fontSize:22}}>{icon}</div>
      <div>
        <div style={{fontSize:11,fontWeight:600,color:"#9CA3AF",letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:3}}>{title}</div>
        <div style={{fontSize:16,fontWeight:700,color:"#111827",fontFamily:"'Fraunces',serif",marginBottom:6}}>{value}</div>
        <Badge status={stat.status} color={stat.color}/>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   ANIMATED SCORE RING
══════════════════════════════════════ */
function ScoreRing({ score, riskColor }: { score:number; riskColor:string }) {
  const [displayed, setDisplayed] = useState(0);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (displayed / 100) * circ;

  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 1.8;
      if (start >= score) { setDisplayed(score); return; }
      setDisplayed(Math.round(start));
      requestAnimationFrame(step);
    };
    const t = setTimeout(() => requestAnimationFrame(step), 400);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ position:"relative", width:140, height:140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{transform:"rotate(-90deg)"}}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10"/>
        <circle cx="70" cy="70" r={r} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - dash}
          style={{transition:"stroke-dashoffset 0.05s linear", filter:`drop-shadow(0 0 10px ${riskColor}88)`}}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FBBF24"/>
            <stop offset="100%" stopColor={riskColor}/>
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
      }}>
        <span style={{fontSize:34,fontWeight:800,color:"white",fontFamily:"'Fraunces',serif",lineHeight:1}}>{displayed}</span>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.6)",letterSpacing:"0.08em",marginTop:2}}>SCORE</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN
══════════════════════════════════════ */
export default function ResultPage() {
  const params = useSearchParams();
  const router = useRouter();
 const raw = params.get("data");

let answers: string[] = ["Yes","Sometimes","Yes","Yes","Yes","Sometimes"];

try {
  if (raw) {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded);

    if (Array.isArray(parsed)) {
      answers = parsed;
    }
  }
} catch (e) {
  console.log("Invalid query data, using default answers");
}

  const { score, risk, riskColor, cycle, hormones, lifestyle, acneStat, weight, hair, energy, mood } = computeResult(answers);

  const metrics = [
    { icon:"🩸", title:"Cycle",     value:cycle.label,     stat:cycle,     delay:0.55 },
    { icon:"🧬", title:"Hormones",  value:hormones.label,  stat:hormones,  delay:0.62 },
    { icon:"🏃‍♀️", title:"Lifestyle", value:lifestyle.label, stat:lifestyle, delay:0.69 },
    { icon:"✨", title:"Acne",      value:acneStat.label,  stat:acneStat,  delay:0.76 },
    { icon:"⚖️", title:"Weight",    value:weight.label,    stat:weight,    delay:0.83 },
    { icon:"🌿", title:"Hair",      value:hair.label,      stat:hair,      delay:0.90 },
    { icon:"😴", title:"Energy",    value:energy.label,    stat:energy,    delay:0.97 },
    { icon:"💫", title:"Mood",      value:mood.label,      stat:mood,      delay:1.04 },
  ];

  const heroGrad =
    risk === "Low"      ? "linear-gradient(160deg,#064E3B 0%,#065F46 40%,#047857 100%)" :
    risk === "Moderate" ? "linear-gradient(160deg,#78350F 0%,#92400E 40%,#B45309 100%)" :
                          "linear-gradient(160deg,#7F1D1D 0%,#991B1B 40%,#BE185D 100%)";

  const headline =
    risk === "Low"      ? "You're doing great! 🌿" :
    risk === "Moderate" ? "Some areas need attention 🌸" :
                          "Time to take action 💪";

  const subline =
    risk === "Low"      ? "Your PCOD symptoms are well managed. Keep up your healthy habits!" :
    risk === "Moderate" ? "A few symptoms suggest your hormones may need some support." :
                          "Multiple PCOD indicators detected. Early action makes a big difference.";

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#FFF1F7 0%,#FDF4FF 50%,#F0F4FF 100%)",
      fontFamily:"'DM Sans',sans-serif",
      position:"relative",
      overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        @keyframes blobDrift{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.07);opacity:.7}}
        @keyframes heroIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}

        .blob{animation:blobDrift 9s ease-in-out infinite}

        /* Mobile */
        @media(max-width:768px){
          .page-grid{grid-template-columns:1fr !important; grid-template-rows:auto auto !important;}
          .hero-panel{border-radius:0 0 32px 32px !important; min-height:auto !important; padding:40px 24px 36px !important;}
          .metrics-panel{padding:24px 16px 40px !important;}
          .metrics-grid{grid-template-columns:1fr 1fr !important;}
        }
        @media(min-width:769px){
          .page-grid{align-items:stretch !important}
        }
      `}</style>

      {/* bg blobs */}
      <div className="blob" style={{
        position:"fixed",top:"-20%",right:"-10%",
        width:"50vw",height:"50vw",maxWidth:520,
        borderRadius:"50%",
        background:"radial-gradient(circle,rgba(244,114,182,0.2) 0%,transparent 70%)",
        filter:"blur(60px)",zIndex:0,pointerEvents:"none",
      }}/>
      <div style={{
        position:"fixed",bottom:"-15%",left:"-8%",
        width:"42vw",height:"42vw",maxWidth:440,
        borderRadius:"50%",
        background:"radial-gradient(circle,rgba(167,139,250,0.18) 0%,transparent 70%)",
        filter:"blur(55px)",zIndex:0,pointerEvents:"none",
      }}/>

      {/* ══ PAGE GRID ══ */}
      <div className="page-grid" style={{
        display:"grid",
        gridTemplateColumns:"380px 1fr",
        minHeight:"100vh",
        position:"relative",zIndex:1,
      }}>

        {/* ══ LEFT HERO PANEL ══ */}
        <motion.div
          className="hero-panel"
          initial={{opacity:0,x:-30}}
          animate={{opacity:1,x:0}}
          transition={{duration:0.6,ease:[0.22,1,0.36,1]}}
          style={{
            background: heroGrad,
            padding:"48px 32px 40px",
            display:"flex",flexDirection:"column",
            alignItems:"center",justifyContent:"center",
            gap:24,
            position:"relative",overflow:"hidden",
            minHeight:"100vh",
          }}
        >
          {/* Decorative circles inside hero */}
          <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:-40,left:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}}/>

          {/* App brand */}
          <motion.div
            initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
            transition={{delay:0.2,duration:0.4}}
            style={{
              display:"flex",alignItems:"center",gap:8,
              padding:"6px 14px",borderRadius:99,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span style={{fontSize:14}}>🌸</span>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.8)",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>PCOD Care</span>
          </motion.div>

          {/* Score ring */}
          <motion.div
            initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
            transition={{delay:0.35,duration:0.5,ease:[0.34,1.56,0.64,1]}}
          >
            <ScoreRing score={score} riskColor={riskColor}/>
          </motion.div>

          {/* Risk badge */}
          <motion.div
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            transition={{delay:0.5,duration:0.4}}
            style={{textAlign:"center"}}
          >
            <div style={{
              display:"inline-flex",alignItems:"center",gap:7,
              padding:"7px 18px",borderRadius:99,
              background:"rgba(255,255,255,0.15)",
              border:"1px solid rgba(255,255,255,0.25)",
              marginBottom:16,
            }}>
              <div style={{
                width:8,height:8,borderRadius:"50%",
                background:riskColor,
                boxShadow:`0 0 8px ${riskColor}`,
              }}/>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.9)",fontWeight:600}}>
                Risk Level: <span style={{color:riskColor}}>{risk}</span>
              </span>
            </div>

            <h2 style={{
              fontFamily:"'Fraunces',serif",
              fontSize:"clamp(20px,2.5vw,24px)",
              fontWeight:700,color:"white",
              lineHeight:1.25,marginBottom:10,
              letterSpacing:"-0.02em",
            }}>{headline}</h2>
            <p style={{
              fontSize:13,color:"rgba(255,255,255,0.6)",
              lineHeight:1.65,maxWidth:260,margin:"0 auto",
            }}>{subline}</p>
          </motion.div>

          {/* Tip */}
          <motion.div
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            transition={{delay:0.65,duration:0.4}}
            style={{
              width:"100%",padding:"14px 16px",borderRadius:16,
              background:"rgba(255,255,255,0.1)",
              border:"1px solid rgba(255,255,255,0.18)",
            }}
          >
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:5}}>💡 Quick Tip</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",lineHeight:1.6}}>
              {risk==="Low"
                ? "Maintain your cycle tracking & stay consistent with anti-inflammatory foods."
                : risk==="Moderate"
                ? "Try reducing refined sugar & add 20 mins of daily walking to balance insulin."
                : "Consult a gynecologist soon. Diet, sleep & stress management can help significantly."
              }
            </div>
          </motion.div>
        </motion.div>

        {/* ══ RIGHT METRICS PANEL ══ */}
        <div className="metrics-panel" style={{
          padding:"40px 32px 40px",
          display:"flex",flexDirection:"column",
          gap:24,overflowY:"auto",
        }}>

          {/* Header */}
          <motion.div
            initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            transition={{delay:0.3,duration:0.4}}
          >
            <div style={{fontSize:12,color:"#9CA3AF",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>
              Your Assessment
            </div>
            <h1 style={{
              fontFamily:"'Fraunces',serif",
              fontSize:"clamp(22px,3vw,28px)",
              fontWeight:800,color:"#111827",
              lineHeight:1.2,letterSpacing:"-0.02em",
            }}>Health Snapshot</h1>
            <p style={{fontSize:13,color:"#6B7280",marginTop:6,lineHeight:1.6}}>
              Based on your responses across 6 key PCOD indicators.
            </p>
          </motion.div>

          {/* Metrics grid */}
          <div className="metrics-grid" style={{
            display:"grid",
            gridTemplateColumns:"repeat(4,1fr)",
            gap:12,
          }}>
            {metrics.map((m) => (
              <MetricCard key={m.title} {...m}/>
            ))}
          </div>

          {/* Overall bar */}
          <motion.div
            initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            transition={{delay:1.1,duration:0.4}}
            style={{
              padding:"20px 20px",borderRadius:20,
              background:"rgba(255,255,255,0.7)",
              border:"1px solid rgba(255,255,255,0.9)",
              backdropFilter:"blur(16px)",
            }}
          >
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:13,fontWeight:600,color:"#374151"}}>Overall PCOD Risk Score</span>
              <span style={{fontSize:13,fontWeight:700,color:riskColor}}>{score}/100</span>
            </div>
            <div style={{height:8,borderRadius:99,background:"rgba(0,0,0,0.07)",overflow:"hidden"}}>
              <motion.div
                initial={{width:0}}
                animate={{width:`${score}%`}}
                transition={{delay:1.2,duration:0.8,ease:"easeOut"}}
                style={{
                  height:"100%",borderRadius:99,
                  background:`linear-gradient(90deg,${riskColor}88,${riskColor})`,
                  boxShadow:`0 0 10px ${riskColor}55`,
                }}
              />
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              <span style={{fontSize:10,color:"#EF4444",fontWeight:500}}>High Risk</span>
              <span style={{fontSize:10,color:"#F59E0B",fontWeight:500}}>Moderate</span>
              <span style={{fontSize:10,color:"#22C55E",fontWeight:500}}>Healthy</span>
            </div>
          </motion.div>

          {/* CTA button */}
          <motion.button
            initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            transition={{delay:1.2,duration:0.4}}
            whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            onClick={()=>router.push("/dashboard")}
            style={{
              width:"100%",padding:"17px 0",borderRadius:16,border:"none",
              background:"linear-gradient(135deg,#BE185D,#F472B6,#FB923C)",
              backgroundSize:"200% auto",
              animation:"shimmer 3s linear infinite",
              color:"white",fontFamily:"inherit",
              fontSize:16,fontWeight:700,
              cursor:"pointer",letterSpacing:"0.02em",
              boxShadow:"0 8px 30px rgba(244,114,182,0.45)",
            }}
          >
            View My Personalised Dashboard →
          </motion.button>

          {/* Retake */}
          <motion.button
            initial={{opacity:0}} animate={{opacity:1}}
            transition={{delay:1.3,duration:0.3}}
            onClick={()=>router.push("/questionnaire")}
            style={{
              background:"none",border:"none",cursor:"pointer",
              fontFamily:"inherit",fontSize:13,color:"#9CA3AF",
              textAlign:"center",padding:"4px",
              transition:"color 0.2s",
            }}
            onMouseEnter={e=>(e.currentTarget.style.color="#6B7280")}
            onMouseLeave={e=>(e.currentTarget.style.color="#9CA3AF")}
          >
            ↺ Retake Assessment
          </motion.button>
        </div>
      </div>
    </div>
  );
}