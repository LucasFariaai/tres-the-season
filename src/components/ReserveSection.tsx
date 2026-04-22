import { useState } from "react";
import { useSeason, seasonLabels } from "@/lib/seasonContext";
import DateTimePicker from "@/components/reservations/DateTimePicker";
import PartySizeSelector from "@/components/reservations/PartySizeSelector";
import ConfirmationCelebration from "@/components/reservations/ConfirmationCelebration";
import { defaultHomeCmsContent, defaultSiteTheme } from "@/lib/site-editor/defaults";
import type { ReserveContent, SiteThemeTokens } from "@/lib/site-editor/types";

interface ReserveSectionProps {
  content?: ReserveContent;
  theme?: SiteThemeTokens;
}

export default function ReserveSection({ content, theme }: ReserveSectionProps) {
  const { season } = useSeason();
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const reserveContent = content ?? defaultHomeCmsContent.reserve;
  const reserveTheme = theme ?? defaultSiteTheme;
  const canSubmit = !!date && !!time;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const code = "TRES-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setConfirmationCode(code);
    setConfirmed(true);
  };

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
            <div className="season-transition rounded-3xl p-6 sm:p-8" style={{ backgroundColor: "rgba(247, 243, 237, 0.1)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)" }}>
              <p className="mb-1 font-accent text-lg text-season-dark season-transition">{seasonLabels[season]} Tasting Menu</p>
              <p className="mb-6 font-display text-3xl text-season-darkest season-transition">{reserveContent.price}</p>
              <DateTimePicker selectedDate={date} selectedTime={time} onDateChange={setDate} onTimeChange={setTime} />
              <div className="my-2 border-t border-white/10" />
              <PartySizeSelector partySize={partySize} onChange={setPartySize} />
              <button onClick={handleSubmit} disabled={!canSubmit} className={`season-transition mt-6 w-full rounded-2xl py-4 font-body text-sm uppercase tracking-widest transition-all duration-300 ${canSubmit ? "bg-season-dark text-season-lightest hover:bg-season-darkest shadow-lg" : "bg-season-lighter/30 text-season-mid cursor-not-allowed"}`}>
                {reserveContent.reserveButton}
              </button>
              <p className="season-transition mt-4 text-center text-xs text-season-mid">{reserveContent.note}</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationCelebration show={confirmed} date={date} time={time} partySize={partySize} confirmationCode={confirmationCode} />
    </section>
  );
}
