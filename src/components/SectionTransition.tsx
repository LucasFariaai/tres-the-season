import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import logoTres from "@/assets/logo-tres-svg.svg";

type TextContent = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

type SectionTransitionProps = {
  from: string;
  to: string;
  height?: string;
  mobileHeight?: string;
  content?: "logo" | TextContent;
};

export default function SectionTransition({
  from,
  to,
  height = "180vh",
  mobileHeight,
  content = "logo",
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isText = content !== "logo";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Background holds `from` for most of the scroll, then snaps to `to` after
  // the text has fully exited so the title never visually merges with the
  // destination color.
  const bgColor = useTransform(scrollYProgress, [0.78, 0.95], [from, to]);

  // Logo marker: enters, holds, fades — lifetime offset so it only appears
  // during the cross-fade phase.
  const logoOpacity = useTransform(
    scrollYProgress,
    [0.38, 0.55, 0.72, 0.88],
    [0, 0.2, 0.2, 0],
  );
  const logoScale = useTransform(
    scrollYProgress,
    [0.38, 0.55, 0.72, 0.88],
    [0.94, 1, 1, 1.04],
  );

  // Text: slides in early, locks in the middle (no movement), and exits
  // completely before the background begins changing.
  const textOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.3, 0.6, 0.76],
    [0, 1, 1, 0],
  );
  const textY = useTransform(
    scrollYProgress,
    [0.08, 0.3, 0.6, 0.76],
    [40, 0, 0, -40],
  );

  if (reducedMotion) {
    return (
      <div
        aria-hidden={isText ? undefined : true}
        style={{
          height: "28vh",
          background: `linear-gradient(to bottom, ${from}, ${to})`,
          color: to,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        {isText ? (
          <div>
            {content.eyebrow ? (
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.6 }}>
                {content.eyebrow}
              </p>
            ) : null}
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 48, marginTop: 8 }}>
              {content.title}
            </h2>
            {content.subtitle ? (
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 18, marginTop: 8, opacity: 0.7 }}>
                {content.subtitle}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  // Default mobile height: tighter than desktop to avoid huge empty cream area.
  const effectiveMobileHeight = mobileHeight ?? (isText ? "115vh" : height);

  return (
    <div
      ref={ref}
      aria-hidden={isText ? undefined : true}
      className="section-transition-root"
      style={
        {
          position: "relative",
          height,
          ["--mt-mobile-h" as string]: effectiveMobileHeight,
        } as React.CSSProperties
      }
    >
      <style>{`
        @media (max-width: 767px) {
          .section-transition-root { height: var(--mt-mobile-h) !important; }
        }
      `}</style>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: bgColor }}
        />

        {/* Noise texture — same overlay used by Concept and GreenStar so the
            dark side of the transition matches the section above. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
          }}
        />

        {isText ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-6 sm:px-10 lg:px-12 pointer-events-none"
            style={{ opacity: textOpacity, y: textY, color: to }}
          >
            <div className="max-w-[820px] text-center">
              {content.eyebrow ? (
                <p
                  className="text-[11px] uppercase tracking-[0.34em]"
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    opacity: 0.55,
                  }}
                >
                  {content.eyebrow}
                </p>
              ) : null}
              <h2
                className="mt-6 text-[56px] leading-[1.02] sm:text-[80px] lg:text-[112px]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                {content.title}
              </h2>
              {content.subtitle ? (
                <p
                  className="mx-auto mt-8 max-w-[620px] text-[17px] leading-[1.6] sm:text-[19px]"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    opacity: 0.8,
                  }}
                >
                  {content.subtitle}
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.img
              src={logoTres}
              alt=""
              className="block select-none"
              style={{
                opacity: logoOpacity,
                scale: logoScale,
                width: "clamp(160px, 42vw, 320px)",
                height: "auto",
                mixBlendMode: "difference",
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
