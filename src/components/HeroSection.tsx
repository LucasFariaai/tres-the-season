import { useEffect, useRef, useState } from "react";
import { useSeason, seasonLabels, seasonQuotes } from "@/lib/seasonContext";
import heroCellar from "@/assets/hero-cellar.jpg";

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

    // Create 18 particles
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#1A1410]">
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0 animate-ken-burns">
        <img
          src={heroCellar}
          alt="Candlelit cellar dining at Tres Rotterdam"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
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

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Season label with decorative lines */}
        <div
          className="flex items-center gap-4 mb-8 opacity-0 hero-stagger-1"
        >
          <span className="block w-12 sm:w-16 h-px bg-season-mid/50" />
          <button
            onClick={() =>
              document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
            }
            className="font-accent text-sm tracking-[0.2em] uppercase text-season-mid season-transition cursor-default"
            style={{ fontSize: "14px" }}
          >
            {seasonLabels[season]}
          </button>
          <span className="block w-12 sm:w-16 h-px bg-season-mid/50" />
        </div>

        {/* Restaurant name */}
        <h1
          className="font-display text-7xl sm:text-8xl md:text-[120px] font-light tracking-wide opacity-0 hero-stagger-2"
          style={{
            color: "#F7F3ED",
            textShadow: "0 2px 40px rgba(26,20,16,0.5)",
          }}
        >
          Tres
        </h1>

        {/* Tagline */}
        <p
          className="font-accent text-lg sm:text-xl mt-6 opacity-0 hero-stagger-3"
          style={{ color: "#B8B0A3" }}
        >
          {seasonQuotes[season]}
        </p>

        {/* Location */}
        <p
          className="font-body text-xs sm:text-[13px] uppercase tracking-[0.2em] mt-4 opacity-0 hero-stagger-4"
          style={{ color: "#B8B0A3" }}
        >
          Kop van Zuid-Entrepot · Rotterdam
        </p>

        {/* Reserve button */}
        <button
          onClick={() =>
            document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-10 px-8 py-3 border border-season-mid text-season-mid font-accent text-sm tracking-[0.15em] uppercase bg-transparent season-transition opacity-0 hero-stagger-5 hover:bg-season-mid hover:text-season-darkest transition-colors duration-300"
        >
          Reserve
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
