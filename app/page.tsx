// app/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Typewriter } from "@/components/ui/typewriter-text";
import { JetBrains_Mono } from "next/font/google";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// ---------------- In-view hook ----------------
function useInView(threshold = 0.6) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ---------------- Highlight ----------------
const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-[#FFF3C4] px-[3px] py-[1px]">{children}</span>
);

// ---------------- Slide 1 sequencing ----------------
const line1 = "hi, i'm jigi. i make things.";
const line2 = "this is an ongoing project.";
const speed = 160;
const pauseMs = 2500;

// ---------------- Section 4 data ----------------
type CheckInKey =
  | "trying"
  | "building"
  | "collecting"
  | "rearranging"
  | "resting";

const CHECK_IN: Record<CheckInKey, { label: string; lines: string[] }> = {
  trying: {
    label: "trying a lot of things",
    lines: [
      "nice.",
      "",
      "you're in exploration mode.",
      "pick one tiny idea.",
      "try it for 30 minutes.",
      "stop when it stops being fun.",
    ],
  },
  building: {
    label: "building something real",
    lines: [
      "love that.",
      "",
      "build the tiniest piece today.",
      "not the whole thing.",
      "just the next part",
    ],
  },
  collecting: {
    label: "collecting ideas quietly",
    lines: [
      "that's okay too.",
      "",
      "open a notes app.",
      "save 3 things that caught your attention today.",
      "don't organize them yet.",
    ],
  },
  rearranging: {
    label: "rearranging my life/space",
    lines: [
      "very relatable.",
      "",
      "change one small corner.",
      "move one object.",
      "notice how it feels.",
    ],
  },
  resting: {
    label: "resting + recharging",
    lines: [
      "good choice.",
      "",
      "do one slow thing today.",
      "no multitasking.",
      "just be there.",
    ],
  },
};

export default function Home() {
  const { ref: section1Ref, inView: section1InView } = useInView(0.6);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [checkIn, setCheckIn] = useState<CheckInKey | null>(null);

  // Slide 1 sequencing
  useEffect(() => {
    if (!section1InView) {
      setShowSecondLine(false);
      return;
    }

    const typingMs = line1.length * speed;

    const timeout = setTimeout(() => {
      setShowSecondLine(true);
    }, typingMs + pauseMs);

    return () => clearTimeout(timeout);
  }, [section1InView]);

  return (
    <main
      className={`${mono.className} h-[100svh] overflow-y-scroll snap-y snap-mandatory scroll-smooth scroll-py-6 bg-white text-black antialiased overscroll-contain`}
    >
      {/* ===================== SECTION 1 ===================== */}
      <section
        ref={section1Ref as any}
        className="h-[100svh] snap-start flex flex-col items-center justify-center px-6"
      >
        <Typewriter
          text={line1}
          speed={speed}
          loop={false}
          sound={true}
          active={section1InView}
          className="text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight leading-none text-center sm:whitespace-nowrap"
        />

        {showSecondLine && (
          <div className="mt-4">
            <Typewriter
              text={line2}
              speed={speed}
              loop={false}
              sound={true}
              active={section1InView}
              className="text-xl sm:text-2xl md:text-3xl opacity-80 text-center"
            />
          </div>
        )}

        <div className="mt-10 text-sm opacity-60 flex flex-col items-center gap-2">
          <span>scroll</span>
          <span className="text-xl">↓</span>
        </div>
      </section>

      {/* ===================== SECTION 2 — BLOG STYLE ===================== */}
      {/* ✅ FIX: remove forced h-[100svh] so content defines height, and use snap-start + min-h to keep snapping pleasant */}
      <section className="snap-start px-6 min-h-[100svh]">
        <div className="max-w-[760px] mx-auto pt-20 md:pt-24 pb-16">
          <div className="border border-black">
            <div className="flex items-center justify-between px-4 py-3 border-b border-black text-sm font-medium">
              <span>About</span>
              <span className="opacity-60">▲</span>
            </div>

            <div className="px-5 py-6 text-[15px] md:text-[16px] leading-[1.7] tracking-[-0.015em]">
              <p>nice to meet you, i’m jigi.</p>

              <p className="mt-6">
                this space is mostly for documenting small creative experiments,
                silly vibe coding projects, and whatever i’m currently curious about.
              </p>

              <p className="mt-6">
                right now, i’m spending most of my time{" "}
                <Highlight>building furniture</Highlight>, experimenting with vibe
                coding, and chasing small creative “what ifs.”
              </p>

              <p className="mt-6">
                sometimes it’s a bed frame. sometimes it’s a tiny website that types
                nicely. sometimes it’s just me trying some silly ideas at 2am or
                moving furniture around more than i probably should.
              </p>

              <p className="mt-6">
                i have a big love for{" "}
                <Highlight>mid-century modern</Highlight> design and i’ve slowly been
                building my space around it with hand built MCM furniture, and
                probably too many “intentional” objects.
              </p>

              <p className="mt-6">
                if you’re also{" "}
                <Highlight>curious, multi-passionate, and slightly experimental</Highlight>{" "}
                welcomeee. this place is for you too.
              </p>

              <p className="mt-8 text-[13px] opacity-60">(scroll ↓)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 4 — MULTI-PASSION CHECK-IN ===================== */}
      {/* ✅ FIX: same deal — avoid hard h-[100svh], give it min height + extra bottom padding so it never “collides” on small screens */}
      <section className="snap-start px-6 min-h-[100svh]">
        <div className="max-w-[760px] mx-auto pt-20 md:pt-24 pb-24">
          {/* Box */}
          <div className="border border-black">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black text-sm font-medium">
              <span>Multi-Passion Check-in</span>
              <span className="opacity-60">▲</span>
            </div>

            {/* Content */}
            {/* ✅ FIX: reduce vertical padding slightly on mobile so content stays inside viewport without pushing into next snap area */}
            <div className="px-5 py-8 md:py-10 text-[15px] md:text-[16px] leading-[1.7] tracking-[-0.015em]">
              <p className="text-base md:text-lg">quick check.</p>

              <p className="mt-4">what feels most like you lately?</p>

              <p className="mt-2 text-[13px] opacity-60">(no pressure. just today.)</p>

              {/* Options */}
              {!checkIn && (
                <div className="mt-8 space-y-3">
                  {(Object.keys(CHECK_IN) as CheckInKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setCheckIn(key)}
                      className="w-full text-left border border-black px-4 py-3 hover:bg-black hover:text-white transition"
                    >
                      {CHECK_IN[key].label}
                    </button>
                  ))}
                </div>
              )}

              {/* Result */}
              {checkIn && (
                <div className="mt-8">
                  <div className="border border-black px-4 py-5">
                    {CHECK_IN[checkIn].lines.map((l, idx) => (
                      <p
                        key={idx}
                        className={l === "" ? "mt-3" : idx === 0 ? "" : "mt-2"}
                      >
                        {l === "" ? "\u00A0" : l}
                      </p>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setCheckIn(null)}
                      className="border border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition"
                    >
                      pick another
                    </button>

                    <p className="text-[13px] opacity-60">(come back tomorrow)</p>
                  </div>
                </div>
              )}

              <p className="mt-10 text-[13px] opacity-60">(end)</p>
            </div>
          </div>

          {/* Footer signature — directly BELOW box */}
          {/* ✅ FIX: give it breathing room + prevent it from being visually clipped on mobile */}
          <div className="mt-3 ml-1 text-[11px] md:text-[12px] opacity-50">
            built with &lt;3 and a lot of coffee
          </div>
        </div>
      </section>
    </main>
  );
}
