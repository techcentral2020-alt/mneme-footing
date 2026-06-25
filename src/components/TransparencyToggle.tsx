"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMetaLayer } from "@/src/hooks/useMetaLayer";

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M2.5 12.5c2.2-4 5.5-6 9.5-6s7.3 2 9.5 6c-2.2 4-5.5 6-9.5 6s-7.3-2-9.5-6Z" />
      <circle cx="12" cy="12.5" r="2.75" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M8.5 7.5 4 12l4.5 4.5" />
      <path d="M15.5 7.5 20 12l-4.5 4.5" />
    </svg>
  );
}

export function TransparencyToggle() {
  const { isTransparent, toggleTransparent } = useMetaLayer();

  return (
    <button
      type="button"
      data-testid="transparency-toggle"
      aria-label={
        isTransparent ? "Show polished portfolio view" : "Show raw data view"
      }
      aria-pressed={isTransparent}
      onClick={toggleTransparent}
      className="fixed bottom-5 right-5 z-50 inline-flex h-8 w-8 transform-gpu items-center justify-center rounded-full bg-white/40 text-text-secondary backdrop-blur-md will-change-transform transition-colors hover:bg-white/55 hover:text-text-primary"
      style={{ transform: "translateZ(0)" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isTransparent ? "code" : "eye"}
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.85, rotate: 8 }}
          transition={{ duration: 0.18 }}
          className="inline-flex"
        >
          {isTransparent ? <CodeIcon /> : <EyeIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
