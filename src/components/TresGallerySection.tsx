import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
          { xPercent: -6 },
          {
            xPercent: 6,
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
    <section ref={sectionRef} className="relative overflow-hidden" style={{ backgroundColor: "#F5EFE6" }}>
      <div className="px-[8%] pb-8 pt-0 text-center">
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "12px",
            fontWeight: 400,
            letterSpacing: "0.18em",
            color: "rgba(78, 55, 39, 0.9)",
            textTransform: "uppercase",
          }}
        >
          {galleryContent.eyebrow}
        </p>
        <p
          className="mt-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "18px",
            fontWeight: 300,
            color: "rgba(26, 20, 16, 0.52)",
          }}
        >
          {galleryContent.subtitle}
        </p>
      </div>

      {useSimpleLayout ? (
        <MobileGallery items={galleryItems} prefersReducedMotion={!!prefersReducedMotion} />
      ) : (
        <div ref={pinWrapRef} className="relative" style={{ height: "85vh", minHeight: "520px" }}>
          <div className="relative h-full overflow-hidden" style={{ backgroundColor: "#F5EFE6" }}>
            <div ref={trackRef} className="flex h-full will-change-transform">
              {galleryItems.map((item, index) => (
                <article
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative h-full shrink-0 overflow-hidden"
                  style={{ width: widthMap[item.width], backgroundColor: "#F5EFE6" }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      ref={(el) => {
                        mediaRefs.current[index] = el;
                      }}
                      src={item.mediaSrc}
                      alt={item.alt}
                      className="absolute left-1/2 top-1/2 h-[125%] w-[125%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
                    />
                  </div>

                  {(item.label || item.caption) && (
                    <div className="absolute bottom-0 left-0 z-[2] p-8">
                      {item.label && (
                        <p
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
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
                            fontFamily: "'Playfair Display', serif",
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

interface MobileGalleryProps {
  items: ReturnType<typeof Array.prototype.map> extends infer _ ? GalleryContent["items"] : never;
  prefersReducedMotion: boolean;
}

function MobileGallery({ items, prefersReducedMotion }: { items: GalleryContent["items"]; prefersReducedMotion: boolean }) {
  // 4 visual areas on mobile:
  //  1) first item (fixed)
  //  2) second item (fixed)
  //  3) horizontal swipe carousel with the middle items
  //  4) last item (fixed)
  // Falls back gracefully when there are fewer than 4 items.
  const safe = items ?? [];
  const top = safe[0];
  const second = safe[1];
  const last = safe.length >= 4 ? safe[safe.length - 1] : undefined;
  const middle = safe.length >= 4 ? safe.slice(2, -1) : safe.slice(2);

  const fixedSlots = [top, second].filter(Boolean) as GalleryContent["items"];
  const tailSlots = last ? [last] : [];

  const renderFixed = (item: GalleryContent["items"][number], index: number) => (
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
      style={{ height: "280px", backgroundColor: "#F5EFE6" }}
    >
      <img src={item.mediaSrc} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
      {(item.label || item.caption) && (
        <div className="absolute bottom-0 left-0 p-8">
          {item.label && (
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
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
                fontFamily: "'Playfair Display', serif",
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
  );

  return (
    <div className="px-0 pb-0">
      <div className="flex flex-col" style={{ backgroundColor: "#F5EFE6" }}>
        {fixedSlots.map((item, idx) => renderFixed(item, idx))}
        {middle.length > 0 && (
          <MobileCarousel items={middle} prefersReducedMotion={prefersReducedMotion} />
        )}
        {tailSlots.map((item, idx) => renderFixed(item, fixedSlots.length + idx))}
      </div>
    </div>
  );
}

function MobileCarousel({
  items,
  prefersReducedMotion,
}: {
  items: GalleryContent["items"];
  prefersReducedMotion: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    align: "center",
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      className="relative"
      style={{ backgroundColor: "#F5EFE6" }}
      aria-label="Gallery carousel"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative shrink-0 basis-[88%] pl-3 first:pl-4 last:pr-4"
            >
              <div className="relative h-[320px] overflow-hidden">
                <img
                  src={item.mediaSrc}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
                {(item.label || item.caption) && (
                  <div className="absolute bottom-0 left-0 p-6">
                    {item.label && (
                      <p
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "11px",
                          fontWeight: 400,
                          letterSpacing: "0.14em",
                          color: "hsl(var(--wine-text) / 0.65)",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.label}
                      </p>
                    )}
                    {item.caption && (
                      <p
                        className="mt-2 max-w-[16rem]"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontStyle: "italic",
                          fontSize: "20px",
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-4" aria-hidden="true">
          {items.map((it, i) => (
            <span
              key={it.id}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === selected ? 18 : 6,
                backgroundColor:
                  i === selected ? "hsl(var(--wine-text) / 0.7)" : "hsl(var(--wine-text) / 0.25)",
              }}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}