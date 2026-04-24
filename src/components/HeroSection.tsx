import { forwardRef, useEffect, useRef, useState } from "react";
import { useSeason, seasonLabels } from "@/lib/seasonContext";
import { useIsMobile } from "@/hooks/use-mobile";
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

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(({ shouldPlay = true, content: _content, theme }, ref) => {
  const { season } = useSeason();
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;

    let fired = false;
    const onTimeUpdate = () => {
      if (fired) return;
      if (window.scrollY > 40) {
        fired = true;
        return;
      }
      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      if (d - video.currentTime < 1.2) {
        fired = true;
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [shouldPlay]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-[hsl(var(--wine-bg))]">
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

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-end justify-between px-6 transition-opacity duration-500 sm:px-10 lg:px-12 ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      >
        <span
          className="font-body text-[11px] uppercase tracking-[0.3em] text-white/70 sm:text-[12px]"
        >
          {seasonLabels[season]}
        </span>
        <span
          className="max-w-[60%] text-right text-[13px] italic text-white/80 sm:text-[14px]"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          Complex without being complicated
        </span>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
