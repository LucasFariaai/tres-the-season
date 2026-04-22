import { Facebook, Instagram } from "lucide-react";
import logoTres from "@/assets/logo-tres-svg.svg";
import { defaultHomeCmsContent, defaultSiteTheme } from "@/lib/site-editor/defaults";
import type { FooterContent, SiteThemeTokens } from "@/lib/site-editor/types";

interface FooterSectionProps {
  content?: FooterContent;
  theme?: SiteThemeTokens;
}

export default function FooterSection({ content, theme }: FooterSectionProps) {
  const footerContent = content ?? defaultHomeCmsContent.footer;
  const footerTheme = theme ?? defaultSiteTheme;

  return (
    <footer className="season-transition py-24" style={{ backgroundColor: footerTheme.footerBackground }}>
      <div className="mx-auto max-w-md px-6 text-center">
        <p className="season-transition mb-10 font-accent text-lg italic text-season-light/50 sm:text-xl">{footerContent.quote}</p>
        <div className="mb-10 flex justify-center gap-5">
          <a href={footerContent.instagramUrl} aria-label="Instagram" className="season-transition text-season-mid/60 transition-colors hover:text-season-light"><Instagram className="h-5 w-5" /></a>
          <a href={footerContent.facebookUrl} aria-label="Facebook" className="season-transition text-season-mid/60 transition-colors hover:text-season-light"><Facebook className="h-5 w-5" /></a>
        </div>
        <img src={logoTres} alt={footerContent.logoAlt} className="mx-auto h-6 w-auto opacity-40" />
      </div>
    </footer>
  );
}
