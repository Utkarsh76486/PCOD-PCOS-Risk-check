"use client";

import dynamic from "next/dynamic";

const ResultPage = dynamic(() => import("./ResultClient"), {
  ssr: false,
});

export default ResultPage;