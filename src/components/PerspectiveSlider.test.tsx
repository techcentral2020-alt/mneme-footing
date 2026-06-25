// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PerspectiveSlider } from "./PerspectiveSlider";

const playClick = vi.fn();

vi.mock("@/src/hooks/useAudioFeedback", () => ({
  useAudioFeedback: () => ({ playClick }),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      transition,
      ...props
    }: React.ComponentProps<"div"> & { transition?: unknown }) => (
      <div data-testid="motion-indicator" data-transition={JSON.stringify(transition)} {...props}>
        {children}
      </div>
    ),
  },
}));

describe("PerspectiveSlider", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    playClick.mockClear();
  });

  it("renders a minimal toggle for Builder and Story states", () => {
    render(<PerspectiveSlider />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Builder")).toBeInTheDocument();
    expect(screen.getByText("Story")).toBeInTheDocument();
  });

  it("toggles state on click", () => {
    render(<PerspectiveSlider />);

    const toggle = screen.getByRole("button");
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("uses a stiff spring transition on the active indicator", () => {
    render(<PerspectiveSlider />);

    const indicator = screen.getByTestId("motion-indicator");
    const transition = JSON.parse(
      indicator.getAttribute("data-transition") ?? "{}",
    );

    expect(transition.type).toBe("spring");
    expect(transition.stiffness).toBeGreaterThanOrEqual(400);
    expect(transition.damping).toBeGreaterThan(0);
  });

  it("calls playClick when toggled", () => {
    render(<PerspectiveSlider />);

    fireEvent.click(screen.getByRole("button"));
    expect(playClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button"));
    expect(playClick).toHaveBeenCalledTimes(2);
  });
});
