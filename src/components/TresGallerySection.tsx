import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

      gsap.to(track, {
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
          <div className="relative h-full overflow-hidden" style={{ backgroundColor: "#191310" }}>
            <div ref={trackRef} className="flex h-full will-change-transform">
              {galleryItems.map((item, index) => (
                <article
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative h-full shrink-0"
                  style={{ width: widthMap[item.width] }}
                >
                  <img
                    src={item.mediaSrc}
                    alt={item.alt}
                    className="block h-full w-full object-cover"
                    draggable={false}
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function MobileGallery({ items, prefersReducedMotion }: { items: GalleryContent["items"]; prefersReducedMotion: boolean }) {
  // Mobile composition:
  //  1) first item (fixed)
  //  2) carousel containing the second item + all middle items (autoplay + swipe)
  //  3) last item (fixed)
  const safe = items ?? [];
  const top = safe[0];
  const last = safe.length >= 3 ? safe[safe.length - 1] : undefined;
  const carouselItems = last ? safe.slice(1, -1) : safe.slice(1);

  const renderFixed = (item: GalleryContent["items"][number]) => (
    <article
      key={item.id}
      className="relative overflow-hidden"
      style={{ height: "320px", backgroundColor: "#191310" }}
    >
      <img src={item.mediaSrc} alt={item.alt} className="block h-full w-full object-cover" loading="lazy" />
    </article>
  );

  return (
    <div className="flex flex-col" style={{ backgroundColor: "#F5EFE6" }}>
      {top && renderFixed(top)}
      {carouselItems.length > 0 && (
        <MobileCarousel items={carouselItems} prefersReducedMotion={prefersReducedMotion} />
      )}
      {last && renderFixed(last)}
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
  const autoplayRef = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: false }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
      dragFree: false,
    },
    prefersReducedMotion ? [] : [autoplayRef.current],
  );
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

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section className="relative" style={{ backgroundColor: "#F5EFE6" }} aria-label="Gallery carousel">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {items.map((item) => (
            <div key={item.id} className="relative shrink-0 grow-0 basis-full">
              <div className="relative h-[360px] overflow-hidden">
                <img
                  src={item.mediaSrc}
                  alt={item.alt}
                  className="block h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === selected ? 18 : 6,
                backgroundColor:
                  i === selected ? "hsl(var(--wine-text) / 0.85)" : "hsl(var(--wine-text) / 0.35)",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}