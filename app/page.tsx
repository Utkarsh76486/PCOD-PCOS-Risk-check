"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);

      const onboarding = localStorage.getItem("onboarding_done");
      const questionnaire = localStorage.getItem("pcod_answers");
      const result = localStorage.getItem("result_done");

      if (!onboarding) {
        router.replace("/onboarding");
      } else if (!questionnaire) {
        router.replace("/questionnaire");
      } else if (!result) {
        router.replace("/result");
      } else {
        router.replace("/dashboard");
      }
    }, 2000); // ⏳ splash delay
  }, []);

  if (showSplash) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-orange-100">
        <h1 className="text-4xl font-bold text-pink-600 animate-pulse">
          WombCare 💖
        </h1>
      </div>
    );
  }

  return null;
}