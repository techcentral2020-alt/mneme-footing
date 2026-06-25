// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ForensicCanvas } from "@/src/components/ForensicCanvas";
import { truckerPathPayload } from "@/src/data/truckerPath";

function getBottleneckNode() {
  const node = truckerPathPayload.systemArchitecture.find(
    (item) => item.type === "bottleneck",
  );
  if (!node) {
    throw new Error("Trucker Path payload must include a bottleneck node");
  }
  return node;
}

function getInterventionNode() {
  const node = truckerPathPayload.systemArchitecture.find(
    (item) => item.type === "intervention",
  );
  if (!node) {
    throw new Error("Trucker Path payload must include an intervention node");
  }
  return node;
}

describe("ForensicCanvas", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a split pane layout with narrative and visual regions", () => {
    render(<ForensicCanvas payload={truckerPathPayload} />);

    const layout = screen.getByTestId("forensic-canvas-layout");
    expect(layout).toHaveStyle({ display: "grid" });

    expect(screen.getByTestId("forensic-narrative-pane")).toBeInTheDocument();
    expect(screen.getByTestId("forensic-visual-pane")).toBeInTheDocument();
  });

  it("populates the left rail with Trucker Path narrative and constraints", () => {
    render(<ForensicCanvas payload={truckerPathPayload} />);

    const narrativePane = screen.getByTestId("forensic-narrative-pane");

    expect(
      within(narrativePane).getByRole("heading", {
        name: truckerPathPayload.title.text,
      }),
    ).toBeInTheDocument();
    expect(
      within(narrativePane).getByText(truckerPathPayload.context.narrative),
    ).toBeInTheDocument();

    for (const constraint of truckerPathPayload.systemConstraints.items) {
      expect(
        within(narrativePane).getByRole("button", {
          name: new RegExp(constraint.label, "i"),
        }),
      ).toBeInTheDocument();
    }
  });

  it("updates the active visual node when a constraint is selected", () => {
    render(<ForensicCanvas payload={truckerPathPayload} />);

    const visualPane = screen.getByTestId("forensic-visual-pane");
    const [firstConstraint, secondConstraint] =
      truckerPathPayload.systemConstraints.items;

    const firstNode = truckerPathPayload.visualNodes.nodes.find(
      (node) => node.id === firstConstraint.visualNodeId,
    );
    const secondNode = truckerPathPayload.visualNodes.nodes.find(
      (node) => node.id === secondConstraint.visualNodeId,
    );

    expect(firstNode).toBeDefined();
    expect(secondNode).toBeDefined();

    fireEvent.click(
      screen.getByRole("button", {
        name: new RegExp(firstConstraint.label, "i"),
      }),
    );

    expect(within(visualPane).getByText(firstNode!.label)).toBeInTheDocument();
    if (firstNode!.type === "diagram") {
      expect(within(visualPane).getByText(firstNode!.content)).toBeInTheDocument();
    }

    fireEvent.click(
      screen.getByRole("button", {
        name: new RegExp(secondConstraint.label, "i"),
      }),
    );

    expect(within(visualPane).getByText(secondNode!.label)).toBeInTheDocument();
    if (secondNode!.type === "diagram") {
      expect(
        within(visualPane).getByText(secondNode!.content),
      ).toBeInTheDocument();
    }
    expect(
      within(visualPane).queryByText(firstNode!.label),
    ).not.toBeInTheDocument();
  });

  it("renders the standard visual view by default", () => {
    render(<ForensicCanvas payload={truckerPathPayload} />);

    const visualPane = screen.getByTestId("forensic-visual-pane");
    const activeConstraint = truckerPathPayload.systemConstraints.items[0];
    const activeNode = truckerPathPayload.visualNodes.nodes.find(
      (node) => node.id === activeConstraint.visualNodeId,
    );

    if (!activeNode) {
      throw new Error("Expected an active visual node for the first constraint");
    }

    expect(
      within(visualPane).getByText(activeNode.label),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("system-architecture-overlay"),
    ).not.toBeInTheDocument();
  });

  it("crossfades to the architecture overlay when the toggle is clicked", async () => {
    render(<ForensicCanvas payload={truckerPathPayload} />);

    const visualPane = screen.getByTestId("forensic-visual-pane");
    const bottleneckNode = getBottleneckNode();

    fireEvent.click(screen.getByTestId("architecture-mode-toggle"));

    const overlay = await waitFor(() =>
      within(visualPane).getByTestId("system-architecture-overlay"),
    );
    expect(within(overlay).getByText(bottleneckNode.label)).toBeInTheDocument();
    expect(
      within(visualPane).queryByRole("article", {
        name: new RegExp(bottleneckNode.label, "i"),
      }),
    ).not.toBeInTheDocument();
  });

  it("toggles architecture mode with spacebar while hovering the visual pane", async () => {
    render(<ForensicCanvas payload={truckerPathPayload} />);

    const visualPane = screen.getByTestId("forensic-visual-pane");
    const interventionNode = getInterventionNode();

    fireEvent.click(screen.getByTestId("architecture-mode-toggle"));
    await waitFor(() =>
      expect(
        within(visualPane).getByTestId("system-architecture-overlay"),
      ).toBeInTheDocument(),
    );

    fireEvent.mouseEnter(visualPane);
    fireEvent.keyDown(window, { code: "Space", key: " " });

    await waitFor(() =>
      expect(
        within(visualPane).queryByTestId("system-architecture-overlay"),
      ).not.toBeInTheDocument(),
    );
    expect(within(visualPane).getByRole("article")).toBeInTheDocument();

    fireEvent.keyDown(window, { code: "Space", key: " " });
    await waitFor(() =>
      expect(
        within(visualPane).getByTestId("system-architecture-overlay"),
      ).toBeInTheDocument(),
    );
    expect(
      within(visualPane).getByText(interventionNode.label),
    ).toBeInTheDocument();
  });
});
