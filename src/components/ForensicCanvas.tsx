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
      className="flex aspect-[16/10] w-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500"
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
      className="relative w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
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
      <p className="text-sm text-zinc-500">
        Select a constraint to inspect its forensic visual.
      </p>
    );
  }

  return (
    <article className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-950">{node.label}</h3>
      {node.type === "diagram" ? (
        <pre className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
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
      className="overflow-x-auto rounded border border-zinc-300 bg-zinc-100 p-4 font-mono text-xs leading-5 text-zinc-800"
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
      className="h-4 w-4"
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
        className="grid min-h-[32rem] grid-cols-1 gap-6 lg:grid-cols-[minmax(18rem,1fr)_minmax(24rem,1.2fr)]"
        style={{ display: "grid" }}
      >
        <aside
          data-testid="forensic-narrative-pane"
          className="rounded-xl border border-zinc-300 bg-zinc-100 p-4"
        >
          <RawDataBlock testId="forensic-raw-narrative" value={narrativePayload} />
        </aside>

        <div
          data-testid="forensic-visual-pane"
          className="rounded-xl border border-zinc-300 bg-zinc-100 p-4"
        >
          <RawDataBlock testId="forensic-raw-node" value={activeVisualNode ?? null} />
        </div>
      </section>
    );
  }

  return (
    <section
      data-testid="forensic-canvas-layout"
      className="grid min-h-[32rem] grid-cols-1 gap-6 lg:grid-cols-[minmax(18rem,1fr)_minmax(24rem,1.2fr)]"
      style={{ display: "grid" }}
    >
      <aside
        data-testid="forensic-narrative-pane"
        className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6"
      >
        <header className="space-y-3">
          <h2 className="text-2xl font-semibold text-zinc-950">
            {payload.title.text}
          </h2>
          <p className="text-sm leading-6 text-zinc-600">
            {payload.context.narrative}
          </p>
        </header>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            System Constraints
          </h3>
          <ul className="space-y-2">
            {payload.systemConstraints.items.map((constraint) => {
              const isActive = constraint.id === activeConstraintId;

              return (
                <li key={constraint.id}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveConstraintId(constraint.id)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-300"
                    }`}
                  >
                    <span className="block text-sm font-medium">
                      {constraint.label}
                    </span>
                    <span
                      className={`mt-1 block text-xs leading-5 ${
                        isActive ? "text-zinc-200" : "text-zinc-600"
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

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Intervention
          </h3>
          <p className="text-sm leading-6 text-zinc-700">
            {payload.intervention.summary}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
            {payload.intervention.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>
      </aside>

      <div
        data-testid="forensic-visual-pane"
        className="relative rounded-xl border border-zinc-200 bg-white p-6"
        onMouseEnter={() => setIsVisualPaneHovered(true)}
        onMouseLeave={() => setIsVisualPaneHovered(false)}
      >
        <button
          type="button"
          data-testid="architecture-mode-toggle"
          aria-label="Toggle system architecture view"
          aria-pressed={isArchitectureMode}
          onClick={toggleArchitectureMode}
          className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950"
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
