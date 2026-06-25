"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAudioFeedback } from "@/src/hooks/useAudioFeedback";

type Perspective = "builder" | "story";

const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 500,
  damping: 35,
};

export function PerspectiveSlider() {
  const [perspective, setPerspective] = useState<Perspective>("builder");
  const { playClick } = useAudioFeedback();
  const isStory = perspective === "story";

  const handleToggle = () => {
    setPerspective((current) => (current === "builder" ? "story" : "builder"));
    playClick();
  };

  return (
    <button
      type="button"
      aria-pressed={isStory}
      onClick={handleToggle}
      className="relative inline-flex h-7 w-36 items-center rounded-full bg-white/35 p-0.5 text-[11px] font-medium tracking-wide text-text-secondary backdrop-blur-md"
    >
      <span
        className={`z-10 flex flex-1 items-center justify-center transition-colors ${!isStory ? "text-text-primary" : ""}`}
      >
        Builder
      </span>
      <span
        className={`z-10 flex flex-1 items-center justify-center transition-colors ${isStory ? "text-text-primary" : ""}`}
      >
        Story
      </span>
      <motion.div
        layout
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-0.125rem)] rounded-full bg-white/70 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        animate={{ left: isStory ? "calc(50% + 0.0625rem)" : "0.125rem" }}
        transition={SPRING_TRANSITION}
        data-testid="motion-indicator"
      />
    </button>
  );
}
