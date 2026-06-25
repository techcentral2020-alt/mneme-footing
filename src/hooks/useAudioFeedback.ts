"use client";

import { useCallback, useRef } from "react";

const CLICK_FREQUENCY_HZ = 120;
const CLICK_DURATION_S = 0.05;
const CLICK_ATTACK_GAIN = 0.3;

function scheduleClick(context: AudioContext): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = CLICK_FREQUENCY_HZ;

  const startTime = context.currentTime;
  const endTime = startTime + CLICK_DURATION_S;

  gain.gain.setValueAtTime(CLICK_ATTACK_GAIN, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, endTime);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(endTime);
}

export function useAudioFeedback() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playClick = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;

    if (context.state === "suspended") {
      void context.resume().then(() => {
        scheduleClick(context);
      });
      return;
    }

    scheduleClick(context);
  }, []);

  return { playClick };
}
