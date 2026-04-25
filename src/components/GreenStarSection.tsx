import { useState } from "react";
import { defaultHomeCmsContent } from "@/lib/site-editor/defaults";
import type { GreenStarContent } from "@/lib/site-editor/types";
import michelinGreenStar from "@/assets/michelin-green-star.png";
import knifeCircle from "@/assets/knife-circle.png";
import gaultMillau from "@/assets/gault-millau.png";

interface GreenStarSectionProps {
  content?: GreenStarContent;
}

export default function GreenStarSection({ content }: GreenStarSectionProps) {
  const sectionContent = content ?? defaultHomeCmsContent.greenStar;
  const [hoveredPillar, setHoveredPillar] = useState<string | null>(null);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "hsl(var(--wine-bg))" }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-12 mb-16">
          {/* Recognition emblems: Green Star + Michelin knife + Gault&Millau */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(32px, 4vw, 64px)",
              flexShrink: 0,
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {/* 1. Green Star (trevo) — white, transparent */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "clamp(170px, 21vw, 290px)",
                width: "clamp(170px, 21vw, 290px)",
              }}
            >
              <img
                src={michelinGreenStar}
                alt="Michelin Green Star"
                style={{
                  height: "62%",
                  width: "auto",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                  opacity: 0.95,
                }}
              />
            </div>

            {/* 2. Michelin knife emblem */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "clamp(170px, 21vw, 290px)",
              }}
            >
              <img
                src={knifeCircle}
                alt="Chef's knife emblem"
                style={{
                  height: "62%",
                  width: "auto",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                  opacity: 0.9,
                }}
              />
            </div>

            {/* 3. Gault&Millau logo + native rating (16,5/20 + 3 chef hats) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(10px, 1.2vw, 16px)",
                height: "clamp(170px, 21vw, 290px)",
              }}
            >
              <img
                src={gaultMillau}
                alt="Gault&Millau"
                style={{
                  height: "42%",
                  width: "auto",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                  opacity: 0.9,
                }}
              />
              <div
                aria-label="Gault&Millau rating: 16,5 out of 20"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  color: "hsl(var(--wine-text))",
                  opacity: 0.92,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(15px, 1.4vw, 19px)",
                    letterSpacing: "0.02em",
                  }}
                >
                  <span>16,5</span>
                  <span style={{ opacity: 0.55, margin: "0 4px" }}>/</span>
                  <span>20</span>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {[0, 1, 2].map((i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2c-2.5 0-4.5 1.8-4.85 4.13A4 4 0 0 0 4 10c0 1.86 1.27 3.43 3 3.87V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6.13c1.73-.44 3-2.01 3-3.87a4 4 0 0 0-3.15-3.87C16.5 3.8 14.5 2 12 2Zm-3 16v-3h2v3H9Zm4 0v-3h2v3h-2Z" />
                    </svg>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Three pillars */}
        <div
          className="grid gap-px sm:grid-cols-3"
          style={{ backgroundColor: "hsl(var(--wine-text) / 0.06)" }}
        >
          {sectionContent.pillars.map((pillar) => {
            const isHovered = hoveredPillar === pillar.id;
            return (
              <div
                key={pillar.id}
                onMouseEnter={() => setHoveredPillar(pillar.id)}
                onMouseLeave={() => setHoveredPillar(null)}
                style={{
                  backgroundColor: "hsl(var(--wine-bg))",
                  padding: "40px 32px",
                  transition: "background-color 300ms cubic-bezier(0.45, 0, 0.15, 1)",
                }}
              >
                <div style={{ marginBottom: "24px" }}>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: "48px",
                      lineHeight: 1,
                      color: "hsl(var(--wine-accent))",
                      opacity: isHovered ? 1 : 0.6,
                      transition: "opacity 300ms ease",
                    }}
                  >
                    {pillar.number}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "hsl(var(--wine-muted) / 0.35)",
                      marginLeft: "8px",
                    }}
                  >
                    {pillar.label}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "22px",
                    color: "hsl(var(--wine-text))",
                    marginBottom: "12px",
                    lineHeight: 1.2,
                  }}
                >
                  {pillar.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.65,
                    color: "hsl(var(--wine-muted) / 0.65)",
                  }}
                >
                  {pillar.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Transition to producers */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div
            style={{
              width: "1px",
              height: "48px",
              background:
                "linear-gradient(to bottom, transparent, hsl(var(--wine-accent) / 0.25))",
            }}
          />
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("producers")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-2"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "hsl(var(--wine-accent) / 0.4)",
              }}
            >
              {sectionContent.ctaLabel}
            </span>
          </button>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="hsl(var(--wine-accent) / 0.4)"
            strokeWidth="1.5"
          >
            <path d="M8 3v10M4 9l4 4 4-4" />
          </svg>
        </div>
      </div>
    </section>
  );
}
