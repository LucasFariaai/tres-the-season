import { useState } from "react";
import { defaultHomeCmsContent } from "@/lib/site-editor/defaults";
import type { GreenStarContent } from "@/lib/site-editor/types";
import michelinGreenStar from "@/assets/michelin-green-star.png";

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
        <div style={{ maxWidth: "600px" }} className="mb-16">
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "hsl(var(--wine-accent))",
              marginBottom: "24px",
            }}
          >
            {sectionContent.eyebrow}
          </p>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(36px, 6vw, 64px)",
              lineHeight: 1.05,
              color: "hsl(var(--wine-text))",
              marginBottom: "12px",
              display: "flex",
              alignItems: "baseline",
              gap: "0.4em",
              flexWrap: "wrap",
            }}
          >
            <span>{sectionContent.title}</span>
            <img
              src={michelinGreenStar}
              alt="Michelin Green Star"
              style={{
                height: "0.95em",
                width: "auto",
                display: "inline-block",
                flexShrink: 0,
                opacity: 0.9,
                transform: "translateY(0.12em)",
              }}
            />
          </h2>

          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "18px",
              color: "hsl(var(--wine-muted) / 0.6)",
              marginBottom: "28px",
            }}
          >
            {sectionContent.award}
          </p>

          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "hsl(var(--wine-muted))",
              marginBottom: "16px",
            }}
          >
            {sectionContent.body}
          </p>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "hsl(var(--wine-muted))",
            }}
          >
            {sectionContent.body2}
          </p>
        </div>
    </section>
  );
}
