import { forwardRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { useSeason, seasonLabels } from "@/lib/seasonContext";
import OrganicReserveButton from "@/components/OrganicReserveButton";
import { defaultHomeCmsContent, defaultSiteTheme } from "@/lib/site-editor/defaults";
import type { ReserveContent, SiteThemeTokens } from "@/lib/site-editor/types";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email" })
  .max(255, { message: "Email is too long" });

type SubscribeStatus = "idle" | "sending" | "success" | "error";

function NewsletterField() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    setStatus("sending");
    setMessage("");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data, source: "reserve_section" });

    if (error) {
      const duplicate = error.code === "23505" || /duplicate/i.test(error.message);
      setStatus(duplicate ? "success" : "error");
      setMessage(duplicate ? "You're already on the list — thank you." : "Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
    setMessage("Thank you — we'll be in touch.");
    setEmail("");
  };

  return (
    <div>
      <h3 className="mb-2 font-display text-lg" style={{ color: "#1A1410" }}>Stay in touch</h3>
      <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-sm">
        <label className="flex-1">
          <span className="sr-only">Your email</span>
          <input
            type="email"
            required
            value={email}
            maxLength={255}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") {
                setStatus("idle");
                setMessage("");
              }
            }}
            placeholder="Your email"
            disabled={status === "sending" || status === "success"}
            className="w-full bg-transparent border-0 border-b pb-1.5 text-sm focus:outline-none transition-colors"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              borderColor: "rgba(26,20,16,0.2)",
              color: "#1A1410",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(26,20,16,0.6)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,20,16,0.2)")}
          />
        </label>
        <button
          type="submit"
          disabled={status === "sending" || status === "success"}
          className="pb-1.5 text-xs uppercase tracking-[0.18em] transition-opacity hover:opacity-60 disabled:opacity-40"
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            color: "#1A1410",
            background: "transparent",
            border: "none",
          }}
        >
          {status === "sending" ? "Sending…" : status === "success" ? "Joined" : "Subscribe"}
        </button>
      </form>
      {message && (
        <p
          className="mt-2 text-xs italic"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: status === "error" ? "rgba(140,30,30,0.8)" : "rgba(26,20,16,0.5)",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

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
              <NewsletterField />
              <div>
                <h3 className="mb-2 font-display text-lg" style={{ color: "#1A1410" }}>{reserveContent.travelTitle}</h3>
                {reserveContent.travelLines.map((line) => <p key={line} className="text-sm text-muted-foreground">{line}</p>)}
              </div>
              {reserveContent.contactPhone && (
                <div>
                  <h3 className="mb-2 font-display text-lg" style={{ color: "#1A1410" }}>{reserveContent.contactTitle}</h3>
                  <p className="text-sm">
                    <a
                      href={`tel:${reserveContent.contactPhone.replace(/[^+\d]/g, "")}`}
                      className="text-muted-foreground transition-opacity hover:opacity-70"
                      style={{ color: "rgba(26,20,16,0.65)", textDecoration: "none" }}
                    >
                      {reserveContent.contactPhone}
                    </a>
                  </p>
                </div>
              )}
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
                    <span style={{ color: "#1A1410" }}>{reserveContent.alcoholicPairingPrice}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-6">
                    <span>Non-alcoholic pairing</span>
                    <span style={{ color: "#1A1410" }}>{reserveContent.nonAlcoholicPairingPrice}</span>
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
