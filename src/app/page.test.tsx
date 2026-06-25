// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import { truckerPathPayload } from "@/src/data/truckerPath";
import { resetMetaLayerForTests } from "@/src/hooks/useMetaLayer";

vi.mock("@/src/hooks/useAudioFeedback", () => ({
  useAudioFeedback: () => ({ playClick: vi.fn() }),
}));

describe("Home page assembly", () => {
  afterEach(() => {
    resetMetaLayerForTests();
    cleanup();
  });

  it("mounts PerspectiveSlider, ForensicCanvas, and TransparencyToggle", () => {
    render(<Home />);

    expect(screen.getByText("Builder")).toBeInTheDocument();
    expect(screen.getByText("Story")).toBeInTheDocument();
    expect(screen.getByTestId("forensic-canvas-layout")).toBeInTheDocument();
    expect(screen.getByTestId("transparency-toggle")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: truckerPathPayload.title.text }),
    ).toBeInTheDocument();
  });
});
