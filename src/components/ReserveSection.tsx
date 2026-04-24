import { forwardRef } from "react";
import { useSeason, seasonLabels } from "@/lib/seasonContext";
import OrganicReserveButton from "@/components/OrganicReserveButton";
import { defaultHomeCmsContent, defaultSiteTheme } from "@/lib/site-editor/defaults";
import type { ReserveContent, SiteThemeTokens } from "@/lib/site-editor/types";

interface ReserveSectionProps {
  content?: ReserveContent;
  theme?: SiteThemeTokens;
}

const ReserveSection = forwardRef<HTMLElement, ReserveSectionProps>(({ content, theme }, ref) => {
  const { season } = useSeason();
  const reserveContent = content ?? defaultHomeCmsContent.reserve;
  const reserveTheme = theme ?? defaultSiteTheme;
  const tastingSeason = seasonLabels[season] || "Spring";

  return (
    <section ref={ref} id="reserve" className="py-24 sm:py-32" style={{ backgroundColor: reserveTheme.reserveBackground }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <p className="mb-4 font-body text-sm uppercase tracking-[0.3em]" style={{ color: "rgba(26,20,16,0.45)" }}>{reserveContent.eyebrow}</p>
            <h2 className="mb-8 font-display text-3xl sm:text-4xl" style={{ color: "#1A1410" }}>{reserveContent.title}</h2>
            <div className="space-y-6 font-body text-foreground">
              <div>
                <h3 className="mb-2 font-display text-lg" style={{ color: "#1A1410" }}>{reserveContent.hoursTitle}</h3>
                {reserveContent.hoursLines.map((line) => <p key={line} className="text-sm text-muted-foreground">{line}</p>)}
              </div>
              <div>
                <h3 className="mb-2 font-display text-lg" style={{ color: "#1A1410" }}>{reserveContent.locationTitle}</h3>
                {reserveContent.locationLines.map((line) => <p key={line} className="text-sm text-muted-foreground">{line}</p>)}
              </div>
              <div>
                <h3 className="mb-2 font-display text-lg" style={{ color: "#1A1410" }}>{reserveContent.travelTitle}</h3>
                {reserveContent.travelLines.map((line) => <p key={line} className="text-sm text-muted-foreground">{line}</p>)}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex h-full w-full flex-col items-center md:items-start md:justify-center">
              <div className="w-full text-center md:max-w-[340px] md:text-left">
                <p
                  className="mb-3 text-[24px] font-normal italic leading-[1.2]"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#1A1410" }}
                >
                  {tastingSeason} Tasting Menu
                </p>
                <p
                  className="mb-8 text-[14px] leading-[1.4]"
                  style={{ fontFamily: "'Source Sans 3', sans-serif", color: "rgba(26,20,16,0.5)" }}
                >
                  €185
                </p>

                <div
                  className="space-y-3 border-t pt-6"
                  style={{
                    borderColor: "rgba(26,20,16,0.12)",
                    fontFamily: "'Source Sans 3', sans-serif",
                    color: "rgba(26,20,16,0.65)",
                    fontSize: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <span>18 servings</span>
                    <span style={{ color: "rgba(26,20,16,0.35)" }}>Tasting menu</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-6">
                    <span>Alcoholic pairing</span>
                    <span style={{ color: "#1A1410" }}>€180</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-6">
                    <span>Non-alcoholic pairing</span>
                    <span style={{ color: "#1A1410" }}>€100</span>
                  </div>
                  <div
                    className="pt-3 mt-1 border-t italic"
                    style={{
                      borderColor: "rgba(26,20,16,0.08)",
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "13px",
                      color: "rgba(26,20,16,0.5)",
                    }}
                  >
                    Reservation recommended 2–3 weeks ahead.
                  </div>
                </div>

                <a
                  href="/wine-list"
                  className="mt-6 inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "13px",
                    letterSpacing: "0.06em",
                    color: "#c9b89e",
                    textDecoration: "none",
                    border: "none",
                    background: "transparent",
                    borderRadius: 0,
                  }}
                >
                  Explore the wine list
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12L12 4M12 4H6M12 4V10" />
                  </svg>
                </a>
              </div>

              <div className="mt-12 flex w-full justify-center md:max-w-[340px] md:justify-center">
                <OrganicReserveButton
                  label="RESERVE"
                  href="https://www.exploretock.com/tresrotterdam"
                  strokeColor="#1A1410"
                  textColor="#1A1410"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ReserveSection.displayName = "ReserveSection";

export default ReserveSection;
