export default function MenuSecretSection() {
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

      <div className="relative z-10 mx-auto max-w-[900px] px-6 py-24 sm:px-8 sm:py-32 lg:px-12">
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "hsl(var(--wine-accent))",
            marginBottom: "28px",
          }}
        >
          The experience
        </p>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(36px, 6vw, 64px)",
            lineHeight: 1.05,
            color: "hsl(var(--wine-text))",
            marginBottom: "32px",
          }}
        >
          The menu is a secret.
        </h2>

        {/* Body */}
        <div style={{ maxWidth: "640px" }}>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "hsl(var(--wine-muted))",
              marginBottom: "20px",
            }}
          >
            Every season reshapes the entire experience at Tres. 18 courses,
            built from what the land and sea offer that week, that day, sometimes
            that morning.
          </p>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "hsl(var(--wine-muted))",
              marginBottom: "20px",
            }}
          >
            We choose not to publish the current menu. We believe the surprise is
            part of the experience, and we kindly suggest you avoid looking at our
            dishes on Instagram before your visit.
          </p>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "19px",
              lineHeight: 1.5,
              color: "hsl(var(--wine-muted) / 0.6)",
              marginBottom: "40px",
            }}
          >
            What you see below are memories of past seasons. What arrives at your
            table will be its own story.
          </p>
        </div>

        {/* Scroll anchor */}
        <button
          type="button"
          onClick={() =>
            document
              .getElementById("menu")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="flex items-center gap-3"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <span
            style={{
              display: "block",
              width: "32px",
              height: "1px",
              backgroundColor: "hsl(var(--wine-accent) / 0.3)",
            }}
          />
          <span
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "hsl(var(--wine-accent) / 0.5)",
            }}
          >
            See past seasons
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="hsl(var(--wine-accent) / 0.5)"
            strokeWidth="1.5"
          >
            <path d="M8 3v10M4 9l4 4 4-4" />
          </svg>
        </button>
      </div>
    </section>
  );
}
