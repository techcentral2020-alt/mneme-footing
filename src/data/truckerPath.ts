import { type ForensicPayload, validateForensicPayload } from "@/src/types/forensic";

const rawTruckerPathPayload: ForensicPayload = {
  title: {
    text: "Trucker Path Revenue Acceleration",
  },
  context: {
    narrative:
      "Trucker Path's sales organization managed revenue across disconnected pipeline views, scattered rep activity, and manual outreach prep. Leadership needed a single console that moved from pipeline visibility through team-wide action volume down to AI-guided outreach, ending with a ready-to-send draft for accounts like Sumter Hauling.",
  },
  systemConstraints: {
    items: [
      {
        id: "tp-constraint-pipeline-visibility",
        label: "No unified pipeline view",
        description:
          "Revenue leaders rebuilt pipeline health from exports and slides instead of one live overview of stage movement and coverage.",
        visualNodeId: "tp-visual-pipeline-overview",
      },
      {
        id: "tp-constraint-team-activity",
        label: "205 actions without shared context",
        description:
          "Field teams logged 205 weekly selling actions across tools with no shared view of who was working which accounts or why.",
        visualNodeId: "tp-visual-team-usage",
      },
      {
        id: "tp-constraint-action-triage",
        label: "Unstructured action queue",
        description:
          "Reps triaged follow-ups manually from inboxes and spreadsheets with no prioritized queue tied to pipeline state.",
        visualNodeId: "tp-visual-action-queue",
      },
      {
        id: "tp-constraint-outreach-guidance",
        label: "No guided next-best-action",
        description:
          "Outreach decisions depended on rep memory instead of AI recommendations grounded in account signals and stage rules.",
        visualNodeId: "tp-visual-ai-recommendation",
      },
      {
        id: "tp-constraint-personalization",
        label: "Slow account-specific drafting",
        description:
          "Personalized outreach for accounts like Sumter Hauling required manual email assembly instead of an AI-generated draft ready for review.",
        visualNodeId: "tp-visual-ai-draft",
      },
    ],
  },
  intervention: {
    summary:
      "Built an internal revenue console that unified pipeline overview, team activity, prioritized actions, AI recommendations, and one-click draft generation for field reps.",
    outcomes: [
      "Replaced fragmented pipeline reporting with a live overview dashboard",
      "Surfaced 205+ weekly team actions in a single usage view",
      "Routed reps through a prioritized action queue tied to CRM signals",
      "Delivered AI next-best-action guidance before outreach",
      "Generated account-specific email drafts such as Sumter Hauling for faster send-ready follow-up",
    ],
  },
  visualNodes: {
    nodes: [
      {
        id: "tp-visual-pipeline-overview",
        type: "image",
        label: "Pipeline overview",
        src: "/assets/truckerpath/pipeline-overview.png",
        alt: "Trucker Path pipeline overview dashboard showing live stage movement and coverage",
      },
      {
        id: "tp-visual-team-usage",
        type: "image",
        label: "Team usage",
        src: "/assets/truckerpath/team-usage.png",
        alt: "Team usage view showing 205 selling actions across the revenue organization",
      },
      {
        id: "tp-visual-action-queue",
        type: "image",
        label: "Action queue",
        src: "/assets/truckerpath/action-queue.jpg",
        alt: "Prioritized action queue surfacing follow-ups tied to pipeline state",
      },
      {
        id: "tp-visual-ai-recommendation",
        type: "image",
        label: "AI recommendation",
        src: "/assets/truckerpath/ai-recommendation.jpg",
        alt: "AI next-best-action recommendation grounded in account signals",
      },
      {
        id: "tp-visual-ai-draft",
        type: "image",
        label: "AI email draft",
        src: "/assets/truckerpath/ai-draft.jpg",
        alt: "AI-generated outreach email draft for Sumter Hauling ready for rep review",
      },
      {
        id: "tp-visual-legacy-diagram",
        type: "diagram",
        label: "Legacy revenue workflow",
        content:
          "CRM exports -> spreadsheet forecasts -> manual outreach logs -> leadership review slides",
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
