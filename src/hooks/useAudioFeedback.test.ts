// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAudioFeedback } from "./useAudioFeedback";

type MockOscillator = {
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  frequency: { value: number };
  type: string;
};

type MockGain = {
  connect: ReturnType<typeof vi.fn>;
  gain: {
    setValueAtTime: ReturnType<typeof vi.fn>;
    exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
  };
};

function createMockAudioContext(state: AudioContextState = "running") {
  const oscillators: MockOscillator[] = [];
  const gains: MockGain[] = [];

  const context = {
    state,
    currentTime: 0,
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    createOscillator: vi.fn(() => {
      const oscillator: MockOscillator = {
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        frequency: { value: 0 },
        type: "sine",
      };
      oscillators.push(oscillator);
      return oscillator;
    }),
    createGain: vi.fn(() => {
      const gain: MockGain = {
        connect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
      };
      gains.push(gain);
      return gain;
    }),
    oscillators,
    gains,
  };

  return context;
}

describe("useAudioFeedback", () => {
  let mockContext: ReturnType<typeof createMockAudioContext>;
  let AudioContextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockContext = createMockAudioContext();
    AudioContextMock = vi.fn(function AudioContext(this: unknown) {
      return mockContext;
    });
    vi.stubGlobal("AudioContext", AudioContextMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("does not create an AudioContext on mount", () => {
    renderHook(() => useAudioFeedback());
    expect(AudioContextMock).not.toHaveBeenCalled();
  });

  it("lazily creates an AudioContext on first playClick", () => {
    const { result } = renderHook(() => useAudioFeedback());

    act(() => {
      result.current.playClick();
    });

    expect(AudioContextMock).toHaveBeenCalledTimes(1);
    expect(mockContext.createOscillator).toHaveBeenCalledTimes(1);
    expect(mockContext.createGain).toHaveBeenCalledTimes(1);
  });

  it("reuses the same AudioContext on subsequent playClick calls", () => {
    const { result } = renderHook(() => useAudioFeedback());

    act(() => {
      result.current.playClick();
      result.current.playClick();
    });

    expect(AudioContextMock).toHaveBeenCalledTimes(1);
    expect(mockContext.createOscillator).toHaveBeenCalledTimes(2);
  });

  it("synthesizes a brief low-frequency click", () => {
    const { result } = renderHook(() => useAudioFeedback());

    act(() => {
      result.current.playClick();
    });

    const oscillator = mockContext.oscillators[0];
    const gain = mockContext.gains[0];

    expect(oscillator.frequency.value).toBeLessThanOrEqual(200);
    expect(oscillator.frequency.value).toBeGreaterThan(0);
    expect(oscillator.connect).toHaveBeenCalledWith(gain);
    expect(gain.connect).toHaveBeenCalledWith(mockContext.destination);
    expect(oscillator.start).toHaveBeenCalled();
    expect(oscillator.stop).toHaveBeenCalled();
    expect(gain.gain.exponentialRampToValueAtTime).toHaveBeenCalled();
  });

  it("resumes a suspended AudioContext without blocking playClick scheduling", async () => {
    mockContext = createMockAudioContext("suspended");
    AudioContextMock = vi.fn(function AudioContext(this: unknown) {
      return mockContext;
    });
    vi.stubGlobal("AudioContext", AudioContextMock);

    const { result } = renderHook(() => useAudioFeedback());

    act(() => {
      result.current.playClick();
    });

    expect(mockContext.resume).toHaveBeenCalledTimes(1);
    expect(mockContext.createOscillator).not.toHaveBeenCalled();

    await act(async () => {
      await mockContext.resume.mock.results[0]?.value;
    });

    expect(mockContext.createOscillator).toHaveBeenCalledTimes(1);
  });

  it("propagates AudioContext construction errors", () => {
    AudioContextMock = vi.fn(function AudioContext() {
      throw new Error("AudioContext unavailable");
    });
    vi.stubGlobal("AudioContext", AudioContextMock);

    const { result } = renderHook(() => useAudioFeedback());

    expect(() => {
      act(() => {
        result.current.playClick();
      });
    }).toThrow("AudioContext unavailable");
  });
});
