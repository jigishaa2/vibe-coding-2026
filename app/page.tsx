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
  <span className="bg-[#FFF3C4] px-[3px] py-[1px]">
    {children}
  </span>
);

// ---------------- Slide 1 sequencing ----------------
const line1 = "hi, i'm jigi. i make things.";
const line2 = "this is an ongoing project.";
const speed = 160;
const pauseMs = 800;

export default function Home() {
  const { ref: section1Ref, inView: section1InView } = useInView(0.6);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [buildText, setBuildText] = useState("");

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
      className={`${mono.className} h-screen overflow-y-scroll snap-y snap-mandatory bg-white text-black antialiased`}
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
    className="text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight leading-tight md:leading-none text-center max-w-[22ch] sm:max-w-none sm:whitespace-nowrap"
  />

  {showSecondLine && (
    <div className="mt-4">
      <Typewriter
        text={line2}
        speed={speed}
        loop={false}
        sound={true}
        active={section1InView}
        className="text-xl sm:text-2xl md:text-3xl opacity-80 text-center max-w-[28ch] mx-auto"
      />
    </div>
  )}

  <div className="mt-10 text-sm opacity-60 flex flex-col items-center gap-2">
    <span>scroll to explore</span>
    <span className="text-xl">↓</span>
  </div>
</section>

      {/* ===================== SECTION 2 ===================== */}
      <section className="h-screen snap-start px-6">
        <div className="max-w-[760px] mx-auto pt-20 md:pt-24">
          <div className="border border-black">
            <div className="flex items-center justify-between px-4 py-3 border-b border-black text-sm font-medium">
              <span>About</span>
              <span className="opacity-60">▲</span>
            </div>

            <div className="px-5 py-6 text-[15px] md:text-[16px] leading-[1.7] tracking-[-0.015em]">
              <p>hi, i’m jigi. i like making things, mostly out of curiosity.</p>

              <p className="mt-6">
                right now, i’m spending most of my time{" "}
                <Highlight>building furniture</Highlight>, experimenting with vibe coding,
                and chasing small creative “what ifs.”
              </p>

              <p className="mt-6">
                sometimes it’s a bed frame. sometimes it’s a tiny website that types nicely.
                sometimes it’s just me trying some silly ideas at 2am or moving furniture around
                more than i probably should.
              </p>

              <p className="mt-6">
                i have a big love for{" "}
                <Highlight>mid-century modern</Highlight> design and i’m slowly been building
                my space around it with hand built MCM furniture, and probably too many
                “intentional” objects.
              </p>

              <p className="mt-6">
                this space is mostly for documenting my small creative experiments,
                vibe coding projects, and whatever i’m currently curious about.
              </p>

              <p className="mt-6">
                if you’re also{" "}
                <Highlight>curious, multi-passionate, and slightly experimental       </Highlight>{" "}    
                 
                              welcomeee. this place is for you too.
              </p>

              <p className="mt-8 text-[13px] opacity-60">(scroll ↓)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 3 — CREATIVE CORNER ===================== */}
      <section className="h-screen snap-start px-6">
        <div className="max-w-[760px] mx-auto pt-20 md:pt-24">
          <div className="border border-black">
            <div className="flex items-center justify-between px-4 py-3 border-b border-black text-sm font-medium">
              <span>Creative Corner</span>
              <span className="opacity-60">▲</span>
            </div>

            <div className="px-5 py-10 text-[15px] md:text-[16px] leading-[1.7] tracking-[-0.015em]">
              <p className="text-base md:text-lg">quick pause.</p>

              <p className="mt-4">what are you trying to build right now?</p>

              <div className="mt-6">
                <input
                  value={buildText}
                  onChange={(e) => setBuildText(e.target.value)}
                  placeholder="type here…"
                  className="w-full border border-black px-3 py-2 text-[15px] md:text-[16px] bg-white outline-none focus:ring-0"
                />
              </div>

              <p className="mt-8 opacity-70">or think about this:</p>

              <p className="mt-3 italic">
                “what small experiment could you try this week?”
              </p>

              <p className="mt-10 text-[13px] opacity-60">
                (saved only in this tab for now)
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
