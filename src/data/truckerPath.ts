import { type ForensicPayload, validateForensicPayload } from "@/src/types/forensic";

const rawTruckerPathPayload: ForensicPayload = {
  title: {
    text: "Trucker Path Revenue Acceleration",
  },
  context: {
    narrative:
      "Trucker Path's sales organization relied on disconnected internal tools, manual pipeline hygiene, and ad hoc reporting to forecast revenue. Leadership needed a faster loop from field activity to forecast confidence without adding headcount.",
  },
  systemConstraints: {
    items: [
      {
        id: "tp-constraint-fragmented-stack",
        label: "Fragmented revenue tooling",
        description:
          "CRM updates, pricing sheets, and outreach trackers lived in separate systems with no shared workflow state.",
        visualNodeId: "tp-visual-tool-sprawl",
      },
      {
        id: "tp-constraint-manual-forecasting",
        label: "Manual forecast assembly",
        description:
          "Revenue reviews required reps and ops to rebuild pipeline snapshots in spreadsheets every week.",
        visualNodeId: "tp-visual-forecast-loop",
      },
      {
        id: "tp-constraint-slow-handoffs",
        label: "Slow sales-to-ops handoffs",
        description:
          "Qualified opportunities stalled while teams reconciled ownership, stage definitions, and next-step accountability.",
        visualNodeId: "tp-visual-handoff-map",
      },
    ],
  },
  intervention: {
    summary:
      "Built internal tools that unified pipeline signals, automated forecast prep, and gave reps a single workspace for revenue-critical actions.",
    outcomes: [
      "Consolidated daily selling workflows into one internal console",
      "Automated weekly forecast rollups from live CRM activity",
      "Surfaced at-risk deals earlier with shared stage and ownership rules",
    ],
  },
  visualNodes: {
    nodes: [
      {
        id: "tp-visual-tool-sprawl",
        type: "diagram",
        label: "Revenue tool sprawl",
        content:
          "CRM exports -> pricing spreadsheets -> manual outreach logs -> leadership slides",
      },
      {
        id: "tp-visual-forecast-loop",
        type: "image",
        label: "Forecast assembly workflow",
        src: "",
        alt: "Placeholder for the automated forecast assembly dashboard",
      },
      {
        id: "tp-visual-handoff-map",
        type: "diagram",
        label: "Sales-to-ops handoff map",
        content:
          "AE qualifies deal -> ops validates stage -> shared console assigns next action -> forecast updates automatically",
      },
    ],
  },
  systemArchitecture: [
    {
      id: "tp-sys-field-activity",
      label: "Field selling activity",
      type: "stable",
      connections: ["tp-sys-crm-signals"],
    },
    {
      id: "tp-sys-crm-signals",
      label: "CRM pipeline signals",
      type: "stable",
      connections: ["tp-sys-manual-forecast"],
    },
    {
      id: "tp-sys-manual-forecast",
      label: "Manual forecast assembly",
      type: "bottleneck",
      connections: ["tp-sys-unified-console"],
    },
    {
      id: "tp-sys-unified-console",
      label: "Unified revenue console",
      type: "intervention",
      connections: ["tp-sys-forecast-confidence"],
    },
    {
      id: "tp-sys-forecast-confidence",
      label: "Forecast confidence",
      type: "stable",
      connections: [],
    },
  ],
};

export const truckerPathPayload = validateForensicPayload(rawTruckerPathPayload);
