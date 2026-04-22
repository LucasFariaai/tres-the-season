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
            <div className="flex h-full flex-col items-center md:items-start md:justify-center">
              <div className="w-full max-w-[320px] text-center md:text-left">
                <p
                  className="mb-2 text-[24px] font-normal italic leading-[1.2]"
                  style={{ fontFamily: "Fraunces, serif", color: "#1A1410" }}
                >
                  {tastingSeason} Tasting Menu
                </p>
                <p
                  className="mb-8 text-[14px] leading-[1.4]"
                  style={{ fontFamily: "Abel, sans-serif", color: "rgba(26,20,16,0.5)" }}
                >
                  €185 per guest
                </p>
                <p
                  className="text-[14px] leading-[1.6]"
                  style={{ fontFamily: "Abel, sans-serif", color: "rgba(26,20,16,0.55)" }}
                >
                  18 servings. Alcoholic pairing €110. Non-alcoholic pairing €100. Reservations recommended 2 to 3 weeks ahead.
                </p>
              </div>

              <div className="mt-12 flex w-full justify-center md:justify-center">
                <OrganicReserveButton
                  label="RESERVE"
                  href="https://www.exploretock.com/tresrotterdam"
                  accentColor="#1A1410"
                />
              </div>

              <p
                className="mt-6 text-center text-[11px] leading-[1.4]"
                style={{ fontFamily: "Abel, sans-serif", color: "rgba(26,20,16,0.3)" }}
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
