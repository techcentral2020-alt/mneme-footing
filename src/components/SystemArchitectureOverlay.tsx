"use client";

import { motion } from "framer-motion";
import type { SystemNode } from "@/src/types/forensic";

interface SystemArchitectureOverlayProps {
  nodes: SystemNode[];
}

const STAGGER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const NODE_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function nodeTypeClasses(type: SystemNode["type"]): string {
  switch (type) {
    case "bottleneck":
      return "border-amber-600 bg-amber-50 text-amber-950";
    case "intervention":
      return "border-accent bg-accent/10 text-accent";
    default:
      return "border-border bg-surface text-text-primary";
  }
}

export function SystemArchitectureOverlay({
  nodes,
}: SystemArchitectureOverlayProps) {
  return (
    <motion.div
      data-testid="system-architecture-overlay"
      className="flex flex-col gap-3"
      variants={STAGGER_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {nodes.map((node) => (
        <motion.article
          key={node.id}
          data-testid={`system-node-${node.id}`}
          data-node-type={node.type}
          variants={NODE_VARIANTS}
          className={`rounded-lg border px-4 py-3 ${nodeTypeClasses(node.type)}`}
        >
          <h3 className="text-sm font-semibold">{node.label}</h3>
          {node.connections.length > 0 ? (
            <p className="mt-1 text-xs text-text-secondary">
              →{" "}
              {node.connections
                .map((connectionId) => {
                  const target = nodes.find((item) => item.id === connectionId);
                  if (!target) {
                    throw new Error(
                      `System node "${node.id}" references missing connection "${connectionId}"`,
                    );
                  }
                  return target.label;
                })
                .join(", ")}
            </p>
          ) : null}
        </motion.article>
      ))}
    </motion.div>
  );
}
