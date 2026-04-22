import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { defaultHomeCmsContent } from "@/lib/site-editor/defaults";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import type { GalleryContent, SiteThemeTokens } from "@/lib/site-editor/types";

gsap.registerPlugin(ScrollTrigger);

const widthMap = {
  narrow: "30vw",
  medium: "45vw",
  wide: "55vw",
} as const;

interface TresGallerySectionProps {
  content?: GalleryContent;
  theme?: SiteThemeTokens;
}

export default function TresGallerySection({ content }: TresGallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLImageElement | HTMLVideoElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const useSimpleLayout = isMobile || prefersReducedMotion;
  const galleryContent = content ?? defaultHomeCmsContent.gallery;
  const galleryItems = useMemo(
    () => galleryContent.items.map((item) => ({ ...item, mediaSrc: resolveMediaUrl(item.mediaSrc) ?? item.mediaSrc })),
    [galleryContent.items],
  );

  useLayoutEffect(() => {
    if (useSimpleLayout) return;

    const section = sectionRef.current;
    const pinWrap = pinWrapRef.current;
    const track = trackRef.current;

    if (!section || !pinWrap || !track) return;

    const ctx = gsap.context(() => {
      const getMaxX = () => Math.max(track.scrollWidth - window.innerWidth, 0);

      const horizontalTween = gsap.to(track, {
        x: () => -getMaxX(),
        ease: "none",
        scrollTrigger: {
          trigger: pinWrap,
          start: "top top",
          end: () => `+=${Math.max(getMaxX() * 1.2, window.innerHeight)}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      mediaRefs.current.forEach((mediaEl, index) => {
        const itemEl = itemRefs.current[index];
        if (!mediaEl || !itemEl) return;

        gsap.fromTo(
          mediaEl,
          { xPercent: -7.5 },
          {
            xPercent: 7.5,
            ease: "none",
            scrollTrigger: {
              trigger: itemEl,
              containerAnimation: horizontalTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, [useSimpleLayout]);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    if (!videos.length) return;

    if (useSimpleLayout) {
      videos.forEach((video) => video.pause());
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            void video.play().catch(() => undefined);
            return;
          }
          video.pause();
        });
      },
      { threshold: 0.45 },
    );

    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [useSimpleLayout]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ backgroundColor: "hsl(var(--wine-bg))" }}>
      <div className="px-[8%] pb-8 pt-16 text-center">
        <p
          style={{
            fontFamily: "Abel, sans-serif",
            fontSize: "12px",
            fontWeight: 400,
            letterSpacing: "0.18em",
            color: "hsl(var(--wine-accent))",
            textTransform: "uppercase",
          }}
        >
          {galleryContent.eyebrow}
        </p>
        <p
          className="mt-3"
          style={{
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
            fontSize: "18px",
            fontWeight: 300,
            color: "hsl(var(--wine-muted) / 0.5)",
          }}
        >
          {galleryContent.subtitle}
        </p>
      </div>

      {useSimpleLayout ? (
        <div className="px-0 pb-0">
          <div className="flex flex-col gap-[2px] bg-[hsl(var(--wine-bg))]">
            {galleryItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.8,
                  ease: [0.45, 0, 0.15, 1],
                  delay: prefersReducedMotion ? 0 : index * 0.08,
                }}
                className="relative overflow-hidden"
                style={{ height: "280px", backgroundColor: "hsl(var(--wine-bg))" }}
              >
                <img src={item.mediaSrc} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
                {(item.label || item.caption) && (
                  <div className="absolute bottom-0 left-0 p-8">
                    {item.label && (
                      <p
                        style={{
                          fontFamily: "Abel, sans-serif",
                          fontSize: "11px",
                          fontWeight: 400,
                          letterSpacing: "0.14em",
                          color: "hsl(var(--wine-text) / 0.6)",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.label}
                      </p>
                    )}
                    {item.caption && (
                      <p
                        className="mt-2 max-w-[18rem]"
                        style={{
                          fontFamily: "Fraunces, serif",
                          fontStyle: "italic",
                          fontSize: "22px",
                          fontWeight: 300,
                          lineHeight: 1.2,
                          color: "hsl(var(--wine-text))",
                        }}
                      >
                        {item.caption}
                      </p>
                    )}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      ) : (
        <div ref={pinWrapRef} className="relative" style={{ height: "85vh", minHeight: "520px" }}>
          <div className="relative h-full overflow-hidden bg-[hsl(var(--wine-bg))]">
            <div ref={trackRef} className="flex h-full gap-[3px] pr-[3px] will-change-transform">
              {galleryItems.map((item, index) => (
                <article
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative h-full shrink-0 overflow-hidden"
                  style={{ width: widthMap[item.width], backgroundColor: "hsl(var(--wine-bg))" }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      ref={(el) => {
                        mediaRefs.current[index] = el;
                      }}
                      src={item.mediaSrc}
                      alt={item.alt}
                      className="absolute left-1/2 top-1/2 h-[115%] w-[115%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
                      loading="lazy"
                    />
                  </div>

                  {(item.label || item.caption) && (
                    <div className="absolute bottom-0 left-0 z-[2] p-8">
                      {item.label && (
                        <p
                          style={{
                            fontFamily: "Abel, sans-serif",
                            fontSize: "11px",
                            fontWeight: 400,
                            letterSpacing: "0.14em",
                            color: "hsl(var(--wine-text) / 0.6)",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.label}
                        </p>
                      )}
                      {item.caption && (
                        <p
                          className="mt-2 max-w-[18rem]"
                          style={{
                            fontFamily: "Fraunces, serif",
                            fontStyle: "italic",
                            fontSize: "22px",
                            fontWeight: 300,
                            lineHeight: 1.2,
                            color: "hsl(var(--wine-text))",
                          }}
                        >
                          {item.caption}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}