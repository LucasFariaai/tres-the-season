import { useEffect, useState } from "react";
import logoTres from "@/assets/logo-tres-svg.svg";

interface IntroOverlayProps {
  onComplete: () => void;
}

const MIN_DOTS_MS = 1200;   // dots show at least this long
const MAX_DOTS_MS = 12000;  // safety: never block more than 12s
const LOGO_MS = 1500;       // logo display duration
const FADE_MS = 700;        // fade out duration

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [phase, setPhase] = useState<"dots" | "logo" | "out">("dots");
  const [hidden, setHidden] = useState(false);

  // Advance from "dots" to "logo" only after the page is fully loaded
  // (or after MAX_DOTS_MS as a safety net). Always honor MIN_DOTS_MS.
  useEffect(() => {
    const start = performance.now();
    let advanced = false;
    let logoTimer: number | undefined;
    let outTimer: number | undefined;

    const advance = () => {
      if (advanced) return;
      advanced = true;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_DOTS_MS - elapsed);
      window.setTimeout(() => {
        setPhase("logo");
        logoTimer = window.setTimeout(() => {
          setPhase("out");
          outTimer = window.setTimeout(() => {
            setHidden(true);
            onComplete();
          }, FADE_MS);
        }, LOGO_MS);
      }, wait);
    };

    const onLoad = () => advance();
    const safety = window.setTimeout(advance, MAX_DOTS_MS);

    if (document.readyState === "complete") {
      // Defer one tick so React has a chance to paint the dots first.
      window.setTimeout(advance, MIN_DOTS_MS);
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(safety);
      if (logoTimer) window.clearTimeout(logoTimer);
      if (outTimer) window.clearTimeout(outTimer);
    };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-700"
      style={{ opacity: phase === "out" ? 0 : 1, pointerEvents: phase === "out" ? "none" : "auto" }}
      aria-busy={phase === "dots"}
      aria-live="polite"
    >
      {/* Pulsing dots — loop until page is ready */}
      <div
        className="absolute flex items-center justify-center gap-4 transition-opacity duration-700"
        style={{ opacity: phase === "dots" ? 1 : 0 }}
      >
        <span className="intro-dot" style={{ animationDelay: "0ms" }} />
        <span className="intro-dot" style={{ animationDelay: "200ms" }} />
        <span className="intro-dot" style={{ animationDelay: "400ms" }} />
      </div>

      {/* Logo */}
      <img
        src={logoTres}
        alt="Tres"
        className="absolute transition-opacity duration-700"
        style={{
          opacity: phase === "logo" ? 1 : 0,
          height: "60px",
          width: "auto",
          filter: "brightness(0) invert(1)",
        }}
      />

      <style>{`
        @keyframes intro-dot-pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
        .intro-dot {
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 9999px;
          display: inline-block;
          animation: intro-dot-pulse 1.2s ease-in-out infinite both;
        }
      `}</style>
    </div>
  );
}
