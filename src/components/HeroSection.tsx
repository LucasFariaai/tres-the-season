import { useEffect, useRef, useState } from "react";
import { useSeason, seasonLabels } from "@/lib/seasonContext";
import { useIsMobile } from "@/hooks/use-mobile";
import logoTres from "@/assets/logo-tres-svg.svg";
import { defaultHomeCmsContent, defaultSiteTheme } from "@/lib/site-editor/defaults";
import type { HeroContent, SiteThemeTokens } from "@/lib/site-editor/types";

interface HeroSectionProps {
  shouldPlay?: boolean;
  content?: HeroContent;
  theme?: SiteThemeTokens;
}

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 18; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.3 + 0.1),
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.25 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 184, 122, ${p.opacity})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-[2] h-full w-full pointer-events-none" />;
}

export default function HeroSection({ shouldPlay = true, content, theme }: HeroSectionProps) {
  const { season } = useSeason();
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContent = content ?? defaultHomeCmsContent.hero;
  const heroTheme = theme ?? defaultSiteTheme;

  useEffect(() => {
    if (shouldPlay && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [shouldPlay, isMobile]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[hsl(var(--wine-bg))]">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          key={isMobile ? "mobile" : "desktop"}
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          src={isMobile ? "/videos/hero-mobile.mp4" : "/videos/hero-desktop.mp4"}
        />
      </div>

      <div className="absolute inset-0 z-[1]" style={{ background: heroTheme.heroOverlay }} />
      <FloatingParticles />

      <div className="relative z-10 flex h-full flex-col items-center px-4" style={{ justifyContent: "start", paddingTop: "35vh" }}>
        <div className="hero-stagger-1 mb-8 flex items-center gap-4 opacity-0">
          <span className="block h-px w-12 bg-white/30 sm:w-16" />
          <span className="font-accent text-sm uppercase tracking-[0.2em] text-white">{seasonLabels[season]}</span>
          <span className="block h-px w-12 bg-white/30 sm:w-16" />
        </div>

        <div className="hero-stagger-2 opacity-0">
          <img src={logoTres} alt="Tres" style={{ height: "45px", width: "auto", filter: "brightness(0) invert(1)" }} />
        </div>

        <p className="hero-stagger-3 mt-6 font-accent text-lg text-[#B8B0A3] opacity-0 sm:text-xl">{heroContent.tagline}</p>
        <p className="hero-stagger-4 mt-4 font-body text-xs uppercase tracking-[0.2em] text-[#B8B0A3] opacity-0 sm:text-[13px]">{heroContent.location}</p>

        <button
          onClick={() => document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" })}
          className="hero-stagger-5 mt-10 flex items-center gap-1.5 rounded-full px-6 py-3 font-body text-[13px] tracking-wide text-[#F7F3ED] opacity-0 transition-all duration-300 hover:opacity-90"
          style={{
            backgroundColor: "rgba(247, 243, 237, 0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {heroContent.reserveLabel}
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12L12 4M12 4H6M12 4V10" />
          </svg>
        </button>
      </div>

      <div className={`absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 ${scrolled ? "pointer-events-none opacity-0" : "opacity-60"}`}>
        <span className="block h-8 w-px bg-gradient-to-b from-transparent to-[#B8B0A3] animate-scroll-line" />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#B8B0A3" strokeWidth="1" className="animate-scroll-chevron">
          <path d="M3 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
