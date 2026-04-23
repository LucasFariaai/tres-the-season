import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { defaultHomeCmsContent, defaultSiteTheme } from "@/lib/site-editor/defaults";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import type { ConceptContent, SiteThemeTokens } from "@/lib/site-editor/types";

interface ConceptSectionProps {
  content?: ConceptContent;
  theme?: SiteThemeTokens;
}

export default function ConceptSection({ content, theme }: ConceptSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const sectionContent = content ?? defaultHomeCmsContent.concept;
  const sectionTheme = theme ?? defaultSiteTheme;

  return (
    <section id="concept" ref={sectionRef} className="relative overflow-hidden" style={{ backgroundColor: sectionTheme.conceptBackground }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />
      <div className="mx-auto max-w-7xl px-6 py-28 sm:py-40">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="mb-20 max-w-2xl sm:mb-28">
          <p className="mb-5 uppercase text-[12px] tracking-[0.16em] text-[hsl(var(--wine-accent))]">{sectionContent.eyebrow}</p>
          <h2 className="mb-8 font-display text-[clamp(36px,5.5vw,72px)] italic leading-[1.05] text-[hsl(var(--wine-text))]">{sectionContent.title}</h2>
          <p className="text-[17px] leading-[1.65] text-[hsl(var(--wine-muted))]">{sectionContent.body}</p>
        </motion.div>

        <div className="grid items-start gap-6 md:grid-cols-2 sm:gap-8">
          <motion.div style={{ y: y1 }} className="relative">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1, ease: "easeOut" }} className="relative overflow-hidden">
              <img src={resolveMediaUrl(sectionContent.chefImage) ?? sectionContent.chefImage} alt={sectionContent.chefAlt} className="aspect-[3/4] w-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(24 24% 8% / 0.5), transparent 60%)" }} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.7 }} className="mt-6 sm:mt-8">
              <h3 className="mb-3 font-display text-[clamp(24px,3vw,32px)] italic text-[hsl(var(--wine-text))]">{sectionContent.handsTitle}</h3>
              <p className="max-w-sm text-[17px] leading-[1.65] text-[hsl(var(--wine-muted))]">{sectionContent.handsBody}</p>
            </motion.div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="md:mt-32">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="relative overflow-hidden">
              <img src={resolveMediaUrl(sectionContent.foundersImage) ?? sectionContent.foundersImage} alt={sectionContent.foundersAlt} className="aspect-[3/4] w-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(24 24% 8% / 0.5), transparent 60%)" }} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.7 }} className="mt-6 sm:mt-8">
              <h3 className="mb-3 font-display text-[clamp(24px,3vw,32px)] italic text-[hsl(var(--wine-text))]">{sectionContent.placeTitle}</h3>
              <p className="max-w-sm text-[17px] leading-[1.65] text-[hsl(var(--wine-muted))]">{sectionContent.placeBody}</p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 1 }} className="mt-24 text-center sm:mt-32">
          <div className="mx-auto mb-8 h-16 w-px bg-[hsl(var(--wine-accent)/0.2)]" />
          <p className="mx-auto max-w-lg font-display text-[clamp(20px,2.4vw,28px)] italic text-[hsl(var(--wine-muted)/0.7)]">{sectionContent.quote}</p>
        </motion.div>
      </div>
    </section>
  );
}
