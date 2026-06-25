"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SystemArchitectureOverlay } from "@/src/components/SystemArchitectureOverlay";
import { useMetaLayer } from "@/src/hooks/useMetaLayer";
import type {
  ForensicPayload,
  ImageVisualNode,
  SystemConstraint,
  VisualNode,
} from "@/src/types/forensic";

interface ForensicCanvasProps {
  payload: ForensicPayload;
}

const VISUAL_IMAGE_ASPECT_RATIO = "16 / 10";

const LAYOUT_CLASS =
  "grid h-full min-h-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(18rem,1fr)_minmax(22rem,1.15fr)]";

function findVisualNode(
  nodes: VisualNode[],
  nodeId: string | undefined,
): VisualNode | undefined {
  if (!nodeId) {
    return undefined;
  }

  return nodes.find((node) => node.id === nodeId);
}

function VisualImageFallback({
  alt,
  message,
}: {
  alt: string;
  message: string;
}) {
  return (
    <div
      className="flex aspect-[16/10] w-full items-center justify-center rounded-lg bg-background/60 p-6 text-center text-small text-text-secondary"
      role="img"
      aria-label={alt}
    >
      {message}
    </div>
  );
}

function VisualNodeImage({ node }: { node: ImageVisualNode }) {
  const [hasLoadError, setHasLoadError] = useState(false);
  const hasSource = node.src.trim().length > 0;

  useEffect(() => {
    setHasLoadError(false);
  }, [node.id, node.src]);

  if (!hasSource || hasLoadError) {
    return (
      <VisualImageFallback
        alt={node.alt}
        message={
          hasSource
            ? `Unable to load image for ${node.alt}`
            : `Image unavailable for ${node.alt}`
        }
      />
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg bg-background/40"
      style={{ aspectRatio: VISUAL_IMAGE_ASPECT_RATIO }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={node.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0"
        >
          <Image
            src={node.src}
            alt={node.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
            onError={() => {
              setHasLoadError(true);
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function VisualNodePanel({ node }: { node: VisualNode | undefined }) {
  if (!node) {
    return (
      <p className="text-small text-text-secondary">
        Select a constraint to inspect its forensic visual.
      </p>
    );
  }

  return (
    <article className="space-y-5">
      <h3 className="text-h3 text-text-primary">{node.label}</h3>
      {node.type === "diagram" ? (
        <pre className="whitespace-pre-wrap rounded-lg bg-background/50 p-5 text-small leading-relaxed text-text-secondary">
          {node.content}
        </pre>
      ) : (
        <VisualNodeImage node={node} />
      )}
    </article>
  );
}

function RawDataBlock({
  testId,
  value,
}: {
  testId: string;
  value: unknown;
}) {
  return (
    <pre
      data-testid={testId}
      className="overflow-x-auto rounded-lg bg-background/70 p-4 font-mono text-[11px] leading-5 text-text-primary"
    >
      <code>{JSON.stringify(value, null, 2)}</code>
    </pre>
  );
}

function ArchitectureToggleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="8.5" y="14" width="7" height="7" rx="1.5" />
      <path d="M6.5 10v2.5M17.5 10v2.5M12 10v4" />
    </svg>
  );
}

export function ForensicCanvas({ payload }: ForensicCanvasProps) {
  const { isTransparent } = useMetaLayer();
  const initialConstraintId = payload.systemConstraints.items[0]?.id ?? null;
  const [activeConstraintId, setActiveConstraintId] = useState<string | null>(
    initialConstraintId,
  );
  const [isArchitectureMode, setIsArchitectureMode] = useState(false);
  const [isVisualPaneHovered, setIsVisualPaneHovered] = useState(false);

  const activeConstraint = useMemo<SystemConstraint | undefined>(() => {
    return payload.systemConstraints.items.find(
      (constraint) => constraint.id === activeConstraintId,
    );
  }, [activeConstraintId, payload.systemConstraints.items]);

  const activeVisualNode = useMemo(
    () =>
      findVisualNode(
        payload.visualNodes.nodes,
        activeConstraint?.visualNodeId,
      ),
    [activeConstraint?.visualNodeId, payload.visualNodes.nodes],
  );

  const narrativePayload = useMemo(
    () => ({
      title: payload.title,
      context: payload.context,
      activeConstraint: activeConstraint ?? null,
      intervention: payload.intervention,
    }),
    [activeConstraint, payload.context, payload.intervention, payload.title],
  );

  const toggleArchitectureMode = useCallback(() => {
    setIsArchitectureMode((current) => !current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || !isVisualPaneHovered) {
        return;
      }

      event.preventDefault();
      toggleArchitectureMode();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisualPaneHovered, toggleArchitectureMode]);

  if (isTransparent) {
    return (
      <section
        data-testid="forensic-canvas-layout"
        className={LAYOUT_CLASS}
        style={{ display: "grid" }}
      >
        <aside
          data-testid="forensic-narrative-pane"
          className="min-h-0 overflow-y-auto lg:pr-2"
        >
          <RawDataBlock testId="forensic-raw-narrative" value={narrativePayload} />
        </aside>

        <div
          data-testid="forensic-visual-pane"
          className="min-h-0 lg:sticky lg:top-0 lg:self-start"
        >
          <RawDataBlock testId="forensic-raw-node" value={activeVisualNode ?? null} />
        </div>
      </section>
    );
  }

  return (
    <section
      data-testid="forensic-canvas-layout"
      className={LAYOUT_CLASS}
      style={{ display: "grid" }}
    >
      <aside
        data-testid="forensic-narrative-pane"
        className="min-h-0 space-y-8 overflow-y-auto lg:pr-4"
      >
        <header className="space-y-4">
          <h2 className="text-h2 text-text-primary">{payload.title.text}</h2>
          <p className="text-body leading-[1.75] text-text-secondary">
            {payload.context.narrative}
          </p>
        </header>

        <section className="space-y-4">
          <h3 className="text-small font-medium uppercase tracking-[0.12em] text-text-secondary">
            System Constraints
          </h3>
          <ul className="space-y-3">
            {payload.systemConstraints.items.map((constraint) => {
              const isActive = constraint.id === activeConstraintId;

              return (
                <li key={constraint.id}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveConstraintId(constraint.id)}
                    className={`w-full rounded-lg px-4 py-3.5 text-left transition-colors ${
                      isActive
                        ? "bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                        : "hover:bg-white/50"
                    }`}
                  >
                    <span
                      className={`block text-small font-medium ${isActive ? "text-text-primary" : "text-text-primary/80"}`}
                    >
                      {constraint.label}
                    </span>
                    <span
                      className={`mt-1.5 block text-[13px] leading-relaxed ${
                        isActive ? "text-text-secondary" : "text-text-secondary/80"
                      }`}
                    >
                      {constraint.description}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-small font-medium uppercase tracking-[0.12em] text-text-secondary">
            Intervention
          </h3>
          <p className="text-body leading-[1.75] text-text-primary/90">
            {payload.intervention.summary}
          </p>
          <ul className="list-disc space-y-2 pl-5 text-body leading-[1.75] text-text-secondary">
            {payload.intervention.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>
      </aside>

      <div
        data-testid="forensic-visual-pane"
        className="relative min-h-0 lg:sticky lg:top-0 lg:self-start"
        onMouseEnter={() => setIsVisualPaneHovered(true)}
        onMouseLeave={() => setIsVisualPaneHovered(false)}
      >
        <button
          type="button"
          data-testid="architecture-mode-toggle"
          aria-label="Toggle system architecture view"
          aria-pressed={isArchitectureMode}
          onClick={toggleArchitectureMode}
          className="absolute right-0 top-0 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/40 text-text-secondary backdrop-blur-md transition-colors hover:bg-white/55 hover:text-text-primary"
        >
          <ArchitectureToggleIcon />
        </button>

        <AnimatePresence mode="wait">
          {isArchitectureMode ? (
            <motion.div
              key="architecture-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SystemArchitectureOverlay nodes={payload.systemArchitecture} />
            </motion.div>
          ) : (
            <motion.div
              key="visual-node-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <VisualNodePanel node={activeVisualNode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
