"use client";
import { useScroll, useTransform } from "motion/react";
import React from "react";
import { GoogleGeminiEffect } from "../ui/google-gemini-effect";

export default function Hero() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.6], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.6], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.6], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.6], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.6], [0, 1.2]);

  return (
    <div
      className="h-[200vh] w-full rounded-md relative pt-4 overflow-clip"
      ref={ref}
    >
      <GoogleGeminiEffect
        title="Apollo is a mission-driven platform for building smarter projects."
        description="Next stop? The Moon—launch your ideas, track progress, and reach new heights."
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />
    </div>
  );
}
