import { useSeason, seasonLabels, seasonQuotes } from "@/lib/seasonContext";
import heroWinter from "@/assets/hero-winter.jpg";
import heroSpring from "@/assets/hero-spring.jpg";
import heroSummer from "@/assets/hero-summer.jpg";
import heroAutumn from "@/assets/hero-autumn.jpg";
import type { Season } from "@/lib/seasonContext";

const heroImages: Record<Season, string> = {
  winter: heroWinter,
  spring: heroSpring,
  summer: heroSummer,
  autumn: heroAutumn,
};

export default function HeroSection() {
  const { season } = useSeason();
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background images — all rendered, crossfade via opacity */}
      {(Object.keys(heroImages) as Season[]).map((s) => (
        <div
          key={s}
          className="absolute inset-0 transition-opacity duration-[600ms] ease-in-out"
          style={{ opacity: s === season ? 1 : 0 }}
        >
          <img
            src={heroImages[s]}
            alt={`${seasonLabels[s]} at Tres Rotterdam`}
            className="w-full h-full object-cover animate-ken-burns"
            width={1920}
            height={1080}
            {...(s !== season ? { loading: "lazy" as const } : {})}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-season-darkest/60 season-transition" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <p className="font-body text-sm tracking-[0.3em] uppercase text-season-lighter mb-4 season-transition">
          Tres · Rotterdam
        </p>
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-season-lightest tracking-wide season-transition">
          {seasonLabels[season]}
        </h1>
        <p className="font-accent text-lg sm:text-xl text-season-light mt-6 season-transition max-w-md">
          {seasonQuotes[season]}
        </p>
        <p className="font-body text-xs tracking-[0.2em] text-season-mid mt-8 season-transition">
          {today}
        </p>
        <button
          onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-12 text-season-lighter opacity-60 hover:opacity-100 transition-opacity animate-bounce"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
