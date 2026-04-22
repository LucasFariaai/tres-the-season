import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { defaultHomeCmsContent, defaultSiteTheme } from "@/lib/site-editor/defaults";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import type { SiteThemeTokens, ZoomContent } from "@/lib/site-editor/types";

interface ZoomParallaxSectionProps {
  content?: ZoomContent;
  theme?: SiteThemeTokens;
}

export default function ZoomParallaxSection({ content, theme }: ZoomParallaxSectionProps) {
  const zoomContent = content ?? defaultHomeCmsContent.zoom;
  const zoomTheme = theme ?? defaultSiteTheme;
  const images = zoomContent.images.map((image) => ({ src: resolveMediaUrl(image.src) ?? image.src, alt: image.alt }));

  return (
    <section className="relative" style={{ backgroundColor: zoomTheme.zoomBackground, paddingTop: 0 }}>
      <ZoomParallax images={images} />
    </section>
  );
}
