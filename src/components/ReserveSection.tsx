import { useSeason, seasonLabels } from "@/lib/seasonContext";
import OrganicReserveButton from "@/components/OrganicReserveButton";
import { defaultHomeCmsContent, defaultSiteTheme } from "@/lib/site-editor/defaults";
import type { ReserveContent, SiteThemeTokens } from "@/lib/site-editor/types";

interface ReserveSectionProps {
  content?: ReserveContent;
  theme?: SiteThemeTokens;
}

export default function ReserveSection({ content, theme }: ReserveSectionProps) {
  const { season } = useSeason();
  const reserveContent = content ?? defaultHomeCmsContent.reserve;
  const reserveTheme = theme ?? defaultSiteTheme;
  const tastingSeason = seasonLabels[season] || "Spring";

  return (
    <section id="reserve" className="season-transition py-24 sm:py-32" style={{ backgroundColor: reserveTheme.reserveBackground }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-season-mid season-transition">{reserveContent.eyebrow}</p>
            <h2 className="mb-8 font-display text-3xl text-season-dark season-transition sm:text-4xl">{reserveContent.title}</h2>
            <div className="space-y-6 font-body text-foreground">
              <div>
                <h3 className="mb-2 font-display text-lg text-season-dark season-transition">{reserveContent.hoursTitle}</h3>
                {reserveContent.hoursLines.map((line) => <p key={line} className="text-sm text-muted-foreground">{line}</p>)}
              </div>
              <div>
                <h3 className="mb-2 font-display text-lg text-season-dark season-transition">{reserveContent.locationTitle}</h3>
                {reserveContent.locationLines.map((line) => <p key={line} className="text-sm text-muted-foreground">{line}</p>)}
              </div>
              <div>
                <h3 className="mb-2 font-display text-lg text-season-dark season-transition">{reserveContent.travelTitle}</h3>
                {reserveContent.travelLines.map((line) => <p key={line} className="text-sm text-muted-foreground">{line}</p>)}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex h-full w-full flex-col items-center md:items-start md:justify-center">
              <div className="w-full text-center md:max-w-[320px] md:text-left">
                <p
                  className="mb-2 text-[24px] font-normal italic leading-[1.2]"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#1A1410" }}
                >
                  {tastingSeason} Tasting Menu
                </p>
                <p
                  className="mb-8 text-[14px] leading-[1.4]"
                  style={{ fontFamily: "'Source Sans 3', sans-serif", color: "rgba(26,20,16,0.5)" }}
                >
                  €185 per guest
                </p>
                <p
                  className="text-[14px] leading-[1.6]"
                  style={{ fontFamily: "'Source Sans 3', sans-serif", color: "rgba(26,20,16,0.55)" }}
                >
                  18 servings. Alcoholic pairing €110. Non-alcoholic pairing €100. Reservations recommended 2 to 3 weeks ahead.
                </p>

                <a
                  href="/wine-list"
                  className="mt-4 inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
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
                  Explore the carta
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12L12 4M12 4H6M12 4V10" />
                  </svg>
                </a>
              </div>

              <div className="mt-12 flex w-full justify-center md:max-w-[320px] md:justify-center">
                <OrganicReserveButton
                  label="RESERVE"
                  href="https://www.exploretock.com/tresrotterdam"
                  strokeColor="#1A1410"
                  textColor="#1A1410"
                />
              </div>

              <p
                className="mt-6 text-center text-[11px] leading-[1.4]"
                style={{ fontFamily: "'Source Sans 3', sans-serif", color: "rgba(26,20,16,0.3)" }}
              >
                You will be redirected to Tock
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
