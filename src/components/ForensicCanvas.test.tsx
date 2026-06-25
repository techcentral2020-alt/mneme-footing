// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ForensicCanvas } from "@/src/components/ForensicCanvas";
import { truckerPathPayload } from "@/src/data/truckerPath";

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
});
