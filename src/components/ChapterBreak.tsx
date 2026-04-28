import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ChapterBreakProps {
  number?: string;
  category?: string;
  word: string;
  subtitle: string;
}

export default function ChapterBreak({
  number = "NO. 01",
  category = "THE LARDER",
  word,
  subtitle,
}: ChapterBreakProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panel = panelRef.current;
    const label = labelRef.current;
    const wordEl = wordRef.current;
    const sub = subtitleRef.current;
    if (!panel || !label || !wordEl || !sub) return;

    gsap.set([label, wordEl, sub], { opacity: 0 });
    if (!prefersReduced) gsap.set(wordEl, { y: 24 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      if (prefersReduced) {
        tl.to([label, wordEl, sub], { opacity: 1, duration: 0.3, ease: "power1.out" });
      } else {
        const ease = "power3.out";
        // Word at t=0.2s, label at t=0 (200ms before word), subtitle at t=0.6s (400ms after word)
        tl.to(label, { opacity: 1, duration: 1.2, ease }, 0)
          .to(wordEl, { opacity: 1, y: 0, duration: 1.2, ease }, 0.2)
          .to(sub, { opacity: 1, duration: 1.2, ease }, 0.6);
      }
    }, panel);

    return () => ctx.revert();
  }, []);

  return (
    <div aria-hidden={false} className="relative w-full">
      {/* Top transition strip — 25px */}
      <div
        style={{
          height: "25px",
          background: "linear-gradient(to bottom, #1A1410 0%, #2A1810 100%)",
        }}
      />

      {/* Main chapter panel */}
      <div
        ref={panelRef}
        data-chapter-panel
        className="flex items-center justify-center px-6 chapter-panel"
        style={{
          backgroundColor: "#2A1810",
          minHeight: "320px",
        }}
      >
        <div
          className="flex flex-col items-center text-center"
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <p
            ref={labelRef}
            style={{
              fontFamily: "var(--font-sans, var(--font-body))",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#C17D3E",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            {number} · {category}
          </p>

          <h2
            ref={wordRef}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(64px, 10vw, 120px)",
              lineHeight: 1,
              color: "#F5EFE6",
              letterSpacing: "-0.01em",
              marginBottom: "20px",
            }}
          >
            {word}
          </h2>

          <p
            ref={subtitleRef}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "18px",
              color: "#C8B89A",
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Bottom fade strip — rounder, perceptually smooth dissolve */}
      <div className="relative w-full h-[280px] sm:h-[420px] lg:h-[640px]">
        {/* Base gradient — 22 stops, smooth-step distribution, neutral warm taupe mids */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #2A1810 0%, #2A1810 12%, #2B1911 18%, #2D1B13 24%, #301E15 30%, #352218 36%, #3C281E 42%, #463224 48%, #523D2D 54%, #614C39 60%, #725D48 65%, #847058 70%, #978670 75%, #AA9B86 80%, #BDB09C 84%, #CFC4B2 88%, #DED5C5 91%, #E9E2D4 94%, #F0EADD 96%, #F4EEE3 98%, #F5EFE6 100%)",
          }}
        />
        {/* Top edge softener — blends into the panel above */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(42,24,16,0.4) 0%, transparent 70%)",
          }}
        />
        {/* Bottom edge softener — blends into the photo grid below */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(245,239,230,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      <style>{`
        .chapter-panel { height: 40vh; }
        @media (max-width: 767px) {
          .chapter-panel { height: 32vh; }
        }
      `}</style>
    </div>
  );
}
