"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [answers, setAnswers] = useState<string[]>([
    "Yes",
    "Sometimes",
    "Yes",
    "Yes",
    "Yes",
    "Sometimes",
  ]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("data");

      if (raw) {
        const decoded = decodeURIComponent(raw);
        const parsed = JSON.parse(decoded);

        if (Array.isArray(parsed)) {
          setAnswers(parsed);
        }
      }
    } catch (e) {
      console.log("Invalid query data");
    }
  }, []);

  // Risk calculation logic (same as before)
  const score = answers.filter((ans) => ans === "Yes").length;

  let result = "";
  let color = "";

  if (score <= 2) {
    result = "Low Risk 😊";
    color = "text-green-600";
  } else if (score <= 4) {
    result = "Moderate Risk ⚠️";
    color = "text-yellow-600";
  } else {
    result = "High Risk 🚨";
    color = "text-red-600";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Your Result</h1>

        <p className={`text-xl font-semibold ${color}`}>
          {result}
        </p>

        <p className="mt-4 text-gray-600">
          This is a basic assessment. Please consult a doctor for proper diagnosis.
        </p>
      </div>
    </div>
  );
}