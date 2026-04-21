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
              fontFamily: "'Fraunces', serif",
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
              fontFamily: "'Fraunces', serif",
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

      {/* Bottom fade strip */}
      <div
        id="chapter-fade-strip"
        style={{
          background:
            "linear-gradient(to bottom, #2A1810 0%, #2A1810 15%, #2A1811 22%, #2B1A14 30%, #2F1F18 38%, #3A2A20 45%, #4A3A2C 52%, #66553F 58%, #897858 64%, #AA9A78 70%, #C5B89A 76%, #DBD0B8 82%, #E8DDC9 88%, #F0E8D8 94%, #F5EFE6 100%)",
        }}
      />

      <style>{`
        .chapter-panel { height: 40vh; }
        #chapter-fade-strip { height: 500px; }
        @media (max-width: 1023px) {
          #chapter-fade-strip { height: 320px; }
        }
        @media (max-width: 767px) {
          .chapter-panel { height: 32vh; }
        }
        @media (max-width: 639px) {
          #chapter-fade-strip { height: 220px; }
        }
      `}</style>
    </div>
  );
}
