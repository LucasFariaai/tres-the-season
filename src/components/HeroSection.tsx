import { useEffect, useRef, useState } from "react";
import { useSeason, seasonLabels, seasonQuotes } from "@/lib/seasonContext";
import { useIsMobile } from "@/hooks/use-mobile";
import logoTres from "@/assets/logo-tres.png";

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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
    />
  );
}

export default function HeroSection() {
  const { season } = useSeason();
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#1A1410]">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          key={isMobile ? "mobile" : "desktop"}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          src={isMobile ? "/videos/hero-mobile.mp4" : "/videos/hero-desktop.mp4"}
        />
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(26,20,16,0.15) 0%, rgba(26,20,16,0.55) 60%, rgba(26,20,16,0.85) 100%)",
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Content — positioned at ~45% from top */}
      <div className="relative z-10 h-full flex flex-col items-center px-4" style={{ justifyContent: "start", paddingTop: "35vh" }}>
        {/* Season label */}
        <div className="flex items-center gap-4 mb-8 opacity-0 hero-stagger-1">
          <span className="block w-12 sm:w-16 h-px bg-white/30" />
          <span
            className="font-accent text-sm tracking-[0.2em] uppercase season-transition"
            style={{ color: "#FFFFFF", fontSize: "14px" }}
          >
            {seasonLabels[season]}
          </span>
          <span className="block w-12 sm:w-16 h-px bg-white/30" />
        </div>

        {/* Animated dots */}
        <div className="flex justify-center items-center gap-3 opacity-0 hero-stagger-2">
          <span className="w-4 h-4 bg-white rounded-full animate-bolinha" style={{ animationDelay: "0s" }} />
          <span className="w-4 h-4 bg-white rounded-full animate-bolinha" style={{ animationDelay: "0.2s" }} />
          <span className="w-4 h-4 bg-white rounded-full animate-bolinha" style={{ animationDelay: "0.4s" }} />
        </div>

        {/* Tagline */}
        <p
          className="font-accent text-lg sm:text-xl mt-6 opacity-0 hero-stagger-3"
          style={{ color: "#B8B0A3" }}
        >
          Complex without being complicated.
        </p>

        {/* Location */}
        <p
          className="font-body text-xs sm:text-[13px] uppercase tracking-[0.2em] mt-4 opacity-0 hero-stagger-4"
          style={{ color: "#B8B0A3" }}
        >
          Kop van Zuid-Entrepot · Rotterdam
        </p>

        {/* Reserve button — glassy style */}
        <button
          onClick={() =>
            document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-10 flex items-center gap-1.5 text-[13px] font-body tracking-wide px-6 py-3 rounded-full transition-all duration-300 opacity-0 hero-stagger-5 hover:opacity-90"
          style={{
            backgroundColor: "rgba(247, 243, 237, 0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#F7F3ED",
          }}
        >
          Reserve
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12L12 4M12 4H6M12 4V10" />
          </svg>
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-opacity duration-500 ${
          scrolled ? "opacity-0 pointer-events-none" : "opacity-60"
        }`}
      >
        <span className="block w-px h-8 bg-gradient-to-b from-transparent to-[#B8B0A3] animate-scroll-line" />
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="#B8B0A3"
          strokeWidth="1"
          className="animate-scroll-chevron"
        >
          <path d="M3 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
