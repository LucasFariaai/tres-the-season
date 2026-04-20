import { useEffect, useState } from "react";
import logoTres from "@/assets/logo-tres-svg.svg";

interface IntroOverlayProps {
  onComplete: () => void;
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [dot1, setDot1] = useState(false);
  const [dot2, setDot2] = useState(false);
  const [dot3, setDot3] = useState(false);
  const [phase, setPhase] = useState<"dots" | "logo" | "out">("dots");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDot1(true), 0);          // 0s ponto 1
    const t2 = setTimeout(() => setDot2(true), 1000);       // 1s ponto 2
    const t3 = setTimeout(() => setDot3(true), 2000);       // 2s ponto 3
    const t4 = setTimeout(() => setPhase("logo"), 3000);    // 3s pontos somem, logo entra
    const t5 = setTimeout(() => setPhase("out"), 4500);     // 4.5s logo fade out
    const t6 = setTimeout(() => {                            // 5.2s desmonta + libera vídeo
      setHidden(true);
      onComplete();
    }, 5200);
    return () => {
      [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
    };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-700"
      style={{ opacity: phase === "out" ? 0 : 1, pointerEvents: phase === "out" ? "none" : "auto" }}
    >
      {/* Dots */}
      <div
        className="absolute flex items-center justify-center gap-4 transition-opacity duration-700"
        style={{ opacity: phase === "dots" ? 1 : 0 }}
      >
        <span className="w-3 h-3 bg-white rounded-full transition-opacity duration-700" style={{ opacity: dot1 ? 1 : 0 }} />
        <span className="w-3 h-3 bg-white rounded-full transition-opacity duration-700" style={{ opacity: dot2 ? 1 : 0 }} />
        <span className="w-3 h-3 bg-white rounded-full transition-opacity duration-700" style={{ opacity: dot3 ? 1 : 0 }} />
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
    </div>
  );
}
