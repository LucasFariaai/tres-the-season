import { useState } from "react";

const pillars = [
  {
    id: "local",
    number: "30km",
    label: "radius",
    title: "Radically local",
    body: "Every ingredient is sourced within 30 kilometres of Rotterdam. The fields, the coast, the forests nearby are our entire pantry.",
  },
  {
    id: "waste",
    number: "0",
    label: "waste",
    title: "Root to leaf, nose to tail",
    body: "Nothing is discarded. What others see as scraps, our fermentation lab transforms into garums, misos and vinegars aged for months.",
  },
  {
    id: "salt",
    number: "0g",
    label: "salt",
    title: "No salt. Ever.",
    body: "Flavour comes from fermentation, pickling, dehydration and koji. Seaweed crystals and misos aged nine months replace what salt once did.",
  },
];

export default function GreenStarSection() {
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
        <div className="flex justify-between items-start flex-wrap gap-8 mb-16">
          <div style={{ maxWidth: "600px" }}>
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
              Recognised
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
              }}
            >
              The Green Star.
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
              Michelin Guide Netherlands, 2025
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
              In 2025, Tres was awarded the Green Michelin Star, a distinction
              that recognises restaurants committed to a more sustainable vision
              of gastronomy. For us, this was not a new direction. It was a
              recognition of how we have always worked.
            </p>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "17px",
                lineHeight: 1.7,
                color: "hsl(var(--wine-muted))",
              }}
            >
              The inspectors described us as "raw and pure, vintage and warm." We
              take that as the highest compliment.
            </p>
          </div>

          {/* Green star watermark */}
          <div
            className="hidden sm:block"
            style={{
              fontSize: "80px",
              lineHeight: 1,
              opacity: 0.08,
              color: "hsl(var(--wine-accent))",
              flexShrink: 0,
              userSelect: "none",
              marginTop: "20px",
            }}
            aria-hidden="true"
          >
            🍀
          </div>
        </div>

        {/* Three pillars */}
        <div
          className="grid gap-px sm:grid-cols-3"
          style={{ backgroundColor: "hsl(var(--wine-text) / 0.06)" }}
        >
          {pillars.map((pillar) => {
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
              Meet the people behind this
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
