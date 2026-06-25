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
      className="relative inline-flex h-10 w-52 items-center rounded-full border border-zinc-200 bg-zinc-100 p-1 text-sm font-medium text-zinc-600"
    >
      <span
        className={`z-10 flex-1 text-center transition-colors ${!isStory ? "text-zinc-950" : ""}`}
      >
        Builder
      </span>
      <span
        className={`z-10 flex-1 text-center transition-colors ${isStory ? "text-zinc-950" : ""}`}
      >
        Story
      </span>
      <motion.div
        layout
        className="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm"
        animate={{ left: isStory ? "calc(50% + 0.125rem)" : "0.25rem" }}
        transition={SPRING_TRANSITION}
        data-testid="motion-indicator"
      />
    </button>
  );
}
