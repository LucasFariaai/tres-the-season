import { forwardRef } from "react";
import { Instagram } from "lucide-react";
import logoTres from "@/assets/logo-tres-svg.svg";
import { defaultHomeCmsContent } from "@/lib/site-editor/defaults";
import type { FooterContent, SiteThemeTokens } from "@/lib/site-editor/types";

interface FooterSectionProps {
  content?: FooterContent;
  theme?: SiteThemeTokens;
}

const INSTAGRAM_URL = "https://www.instagram.com/tresrotterdam/";

const FooterSection = forwardRef<HTMLElement, FooterSectionProps>(({ content }, ref) => {
  const footerContent = content ?? defaultHomeCmsContent.footer;

  return (
    <footer ref={ref} data-footer="tres" className="py-24" style={{ backgroundColor: "hsl(var(--wine-bark))" }}>
      <div className="mx-auto max-w-md px-6 text-center">
        <p className="mb-10 font-accent text-lg italic text-white/55 sm:text-xl">{footerContent.quote}</p>
        <div className="mb-10 flex justify-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white/65 transition-colors hover:text-white"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
        <img
          src={logoTres}
          alt={footerContent.logoAlt}
          className="mx-auto h-6 w-auto opacity-55"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>
    </footer>
  );
});

FooterSection.displayName = "FooterSection";

export default FooterSection;
