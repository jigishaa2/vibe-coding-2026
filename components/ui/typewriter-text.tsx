"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";

let audioCtx: AudioContext | null = null;
let lastClickAt = 0;

// --- TS-safe AudioContext getter (handles Safari + SSR) ---
function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;

  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AC) return null;

  if (!audioCtx) {
    audioCtx = new AC();
  }

  return audioCtx;
}

// --- unlock audio after user interaction (autoplay policy) ---
function unlockAudio(): void {
  const ctx = getAudioCtx();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    // Some browsers require user gesture; ignore rejections gracefully.
    void ctx.resume().catch(() => {});
  }
}

// --- click synth ---
function playTypeClick(volume = 0.035) {
  const ctx = getAudioCtx();
  if (!ctx) return;

  const now = ctx.currentTime;

  const bufferSize = Math.floor(ctx.sampleRate * 0.02);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1800;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(now);
  source.stop(now + 0.03);
}

export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;

  // NEW (you’re already using these)
  sound?: boolean;
  active?: boolean;
}

export function Typewriter({
  text,
  speed = 130,
  cursor = "|",
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
  sound = false,
  active = true,
}: TypewriterProps) {
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  const currentText = textArray[textArrayIndex] || "";

  // --- unlock audio on first user interaction (scroll/click/tap/keys) ---
  useEffect(() => {
    const onFirstInteraction = () => {
      unlockAudio();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("wheel", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };

    window.addEventListener("pointerdown", onFirstInteraction, { passive: true });
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("wheel", onFirstInteraction, { passive: true });
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("wheel", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    if (!currentText) return;

    const timeout = window.setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < currentText.length) {
          setDisplayText((prev) => {
            // Only click when sound=true
            if (sound) {
              const now = performance.now();
              if (now - lastClickAt >= 80) {
                playTypeClick(0.03);
                lastClickAt = now;
              }
            }
            return prev + currentText[currentIndex];
          });
          setCurrentIndex((prev) => prev + 1);
        } else if (loop) {
          window.setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex(0);
          setTextArrayIndex((prev) => (prev + 1) % textArray.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => window.clearTimeout(timeout);
  }, [
    active,
    sound,
    currentIndex,
    isDeleting,
    currentText,
    loop,
    speed,
    deleteSpeed,
    delay,
    displayText,
    textArray.length,
  ]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}
