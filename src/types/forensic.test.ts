import { describe, expect, it } from "vitest";
import { truckerPathPayload } from "@/src/data/truckerPath";
import {
  type ForensicPayload,
  validateForensicPayload,
} from "@/src/types/forensic";

const validPayload: ForensicPayload = {
  title: { text: "Sample Project" },
  context: {
    narrative:
      "A revenue operations team needed faster insight into pipeline health.",
  },
  systemConstraints: {
    items: [
      {
        id: "constraint-a",
        label: "Fragmented CRM data",
        description: "Sales tools did not share a single source of truth.",
        visualNodeId: "node-a",
      },
      {
        id: "constraint-b",
        label: "Manual reporting",
        description: "Weekly revenue reviews required hours of spreadsheet work.",
        visualNodeId: "node-b",
      },
    ],
  },
  intervention: {
    summary:
      "Built internal tooling to unify pipeline signals and automate reporting.",
    outcomes: [
      "Reduced manual prep time for revenue reviews",
      "Surfaced at-risk deals earlier in the cycle",
    ],
  },
  visualNodes: {
    nodes: [
      {
        id: "node-a",
        type: "diagram",
        label: "Data fragmentation map",
        content: "CRM -> spreadsheets -> slide decks",
      },
      {
        id: "node-b",
        type: "image",
        label: "Reporting workflow",
        src: "",
        alt: "Automated reporting dashboard placeholder",
      },
    ],
  },
  systemArchitecture: [
    {
      id: "sys-intake",
      label: "Pipeline intake",
      type: "stable",
      connections: ["sys-bottleneck"],
    },
    {
      id: "sys-bottleneck",
      label: "Manual reporting",
      type: "bottleneck",
      connections: ["sys-intervention"],
    },
    {
      id: "sys-intervention",
      label: "Unified tooling",
      type: "intervention",
      connections: [],
    },
  ],
};

describe("validateForensicPayload", () => {
  it("accepts a fully populated forensic payload", () => {
    expect(() => validateForensicPayload(validPayload)).not.toThrow();
    expect(validateForensicPayload(validPayload)).toEqual(validPayload);
  });

  it("rejects payloads that are not objects", () => {
    expect(() => validateForensicPayload(null)).toThrow(/object/i);
    expect(() => validateForensicPayload("invalid")).toThrow(/object/i);
  });

  it("requires strict title, context, constraints, intervention, and visual nodes", () => {
    expect(() =>
      validateForensicPayload({
        ...validPayload,
        title: { text: "" },
      }),
    ).toThrow(/title/i);

    expect(() =>
      validateForensicPayload({
        ...validPayload,
        context: { narrative: "" },
      }),
    ).toThrow(/context/i);

    expect(() =>
      validateForensicPayload({
        ...validPayload,
        systemConstraints: { items: [] },
      }),
    ).toThrow(/constraint/i);

    expect(() =>
      validateForensicPayload({
        ...validPayload,
        intervention: { summary: "", outcomes: [] },
      }),
    ).toThrow(/intervention/i);

    expect(() =>
      validateForensicPayload({
        ...validPayload,
        visualNodes: { nodes: [] },
      }),
    ).toThrow(/visual node/i);
  });

  it("supports image and diagram visual node variants", () => {
    const payload = validateForensicPayload(validPayload);

    expect(payload.visualNodes.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "diagram", content: expect.any(String) }),
        expect.objectContaining({ type: "image", src: expect.any(String) }),
      ]),
    );
  });

  it("rejects visual nodes with unknown types", () => {
    expect(() =>
      validateForensicPayload({
        ...validPayload,
        visualNodes: {
          nodes: [
            {
              id: "bad-node",
              type: "video" as "image",
              label: "Unsupported",
              src: "",
              alt: "",
            },
          ],
        },
      }),
    ).toThrow(/visual node/i);
  });

  it("rejects constraints that reference missing visual nodes", () => {
    expect(() =>
      validateForensicPayload({
        ...validPayload,
        systemConstraints: {
          items: [
            {
              ...validPayload.systemConstraints.items[0],
              visualNodeId: "missing-node",
            },
          ],
        },
      }),
    ).toThrow(/visual node/i);
  });
});

describe("truckerPathPayload", () => {
  it("populates the forensic schema with Trucker Path revenue acceleration data", () => {
    const payload = validateForensicPayload(truckerPathPayload);

    expect(payload.title.text).toMatch(/trucker path/i);
    expect(payload.context.narrative).toMatch(/revenue|sales/i);
    expect(payload.systemConstraints.items.length).toBeGreaterThan(0);
    expect(payload.intervention.summary).toMatch(/tool|internal/i);
    expect(payload.visualNodes.nodes.some((node) => node.type === "image")).toBe(
      true,
    );
    expect(
      payload.visualNodes.nodes.some((node) => node.type === "diagram"),
    ).toBe(true);
  });
});
