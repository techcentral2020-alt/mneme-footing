"use client";

import { useMemo, useState } from "react";
import type { ForensicPayload, SystemConstraint, VisualNode } from "@/src/types/forensic";

interface ForensicCanvasProps {
  payload: ForensicPayload;
}

function findVisualNode(
  nodes: VisualNode[],
  nodeId: string | undefined,
): VisualNode | undefined {
  if (!nodeId) {
    return undefined;
  }

  return nodes.find((node) => node.id === nodeId);
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
      ) : node.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={node.src}
          alt={node.alt}
          className="max-h-[28rem] w-full rounded-lg border border-zinc-200 object-contain"
        />
      ) : (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-500">
          Image placeholder for {node.alt}
        </p>
      )}
    </article>
  );
}

export function ForensicCanvas({ payload }: ForensicCanvasProps) {
  const initialConstraintId = payload.systemConstraints.items[0]?.id ?? null;
  const [activeConstraintId, setActiveConstraintId] = useState<string | null>(
    initialConstraintId,
  );

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
        className="rounded-xl border border-zinc-200 bg-white p-6"
      >
        <VisualNodePanel node={activeVisualNode} />
      </div>
    </section>
  );
}
