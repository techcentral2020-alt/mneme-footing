// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ForensicCanvas } from "@/src/components/ForensicCanvas";
import { TransparencyToggle } from "@/src/components/TransparencyToggle";
import { truckerPathPayload } from "@/src/data/truckerPath";
import { resetMetaLayerForTests, useMetaLayer } from "./useMetaLayer";

function MetaLayerProbe() {
  const { isTransparent } = useMetaLayer();
  return <div data-testid="meta-layer-probe">{String(isTransparent)}</div>;
}

describe("useMetaLayer", () => {
  afterEach(() => {
    resetMetaLayerForTests();
    cleanup();
  });

  it("defaults isTransparent to false", () => {
    const { result } = renderHook(() => useMetaLayer());
    expect(result.current.isTransparent).toBe(false);
  });

  it("toggles isTransparent through toggleTransparent", () => {
    const { result } = renderHook(() => useMetaLayer());

    act(() => {
      result.current.toggleTransparent();
    });
    expect(result.current.isTransparent).toBe(true);

    act(() => {
      result.current.toggleTransparent();
    });
    expect(result.current.isTransparent).toBe(false);
  });

  it("sets isTransparent explicitly through setTransparent", () => {
    const { result } = renderHook(() => useMetaLayer());

    act(() => {
      result.current.setTransparent(true);
    });
    expect(result.current.isTransparent).toBe(true);

    act(() => {
      result.current.setTransparent(false);
    });
    expect(result.current.isTransparent).toBe(false);
  });

  it("shares global state across hook consumers", () => {
    const { result: first } = renderHook(() => useMetaLayer());
    const { result: second } = renderHook(() => useMetaLayer());

    act(() => {
      first.current.setTransparent(true);
    });

    expect(second.current.isTransparent).toBe(true);
  });
});

describe("TransparencyToggle", () => {
  afterEach(() => {
    resetMetaLayerForTests();
    cleanup();
  });

  it("renders a fixed-position toggle button", () => {
    render(<TransparencyToggle />);

    const toggle = screen.getByTestId("transparency-toggle");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveClass("fixed");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("updates global transparency state when clicked", () => {
    render(
      <>
        <TransparencyToggle />
        <MetaLayerProbe />
      </>,
    );

    expect(screen.getByTestId("meta-layer-probe")).toHaveTextContent("false");

    fireEvent.click(screen.getByTestId("transparency-toggle"));

    expect(screen.getByTestId("meta-layer-probe")).toHaveTextContent("true");
    expect(screen.getByTestId("transparency-toggle")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("ForensicCanvas transparency mode", () => {
  afterEach(() => {
    resetMetaLayerForTests();
    cleanup();
  });

  it("renders raw JSON for the active node when transparency is enabled", () => {
    const { result } = renderHook(() => useMetaLayer());
    const activeConstraint = truckerPathPayload.systemConstraints.items[0];
    const activeNode = truckerPathPayload.visualNodes.nodes.find(
      (node) => node.id === activeConstraint.visualNodeId,
    );

    if (!activeNode) {
      throw new Error("Expected an active visual node for the first constraint");
    }

    render(
      <>
        <TransparencyToggle />
        <ForensicCanvas payload={truckerPathPayload} />
      </>,
    );

    const narrativePane = screen.getByTestId("forensic-narrative-pane");
    expect(
      within(narrativePane).getByRole("heading", {
        name: truckerPathPayload.title.text,
      }),
    ).toBeInTheDocument();

    act(() => {
      result.current.setTransparent(true);
    });

    const rawNarrative = screen.getByTestId("forensic-raw-narrative");
    const rawNode = screen.getByTestId("forensic-raw-node");

    expect(rawNarrative.textContent).toContain(truckerPathPayload.title.text);
    expect(rawNode.textContent).toBe(JSON.stringify(activeNode, null, 2));

    expect(
      within(narrativePane).queryByRole("heading", {
        name: truckerPathPayload.title.text,
      }),
    ).not.toBeInTheDocument();
    expect(within(rawNode).queryByRole("img")).not.toBeInTheDocument();
  });

  it("instantly restores polished UI when transparency is disabled", () => {
    const { result } = renderHook(() => useMetaLayer());

    render(
      <>
        <TransparencyToggle />
        <ForensicCanvas payload={truckerPathPayload} />
      </>,
    );

    act(() => {
      result.current.setTransparent(true);
    });
    expect(screen.getByTestId("forensic-raw-node")).toBeInTheDocument();

    act(() => {
      result.current.setTransparent(false);
    });

    expect(screen.queryByTestId("forensic-raw-node")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: truckerPathPayload.title.text }),
    ).toBeInTheDocument();
  });
});
