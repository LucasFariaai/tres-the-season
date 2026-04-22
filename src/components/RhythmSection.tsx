import { seasonPageContent, seasonQuotes, useSeason } from "@/lib/seasonContext";

function getOpenState() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isOpenDay = day >= 3 && day <= 6;
  const isOpenHour = hour >= 18 && hour < 23;

  return isOpenDay && isOpenHour;
}

export default function RhythmSection() {
  const { season } = useSeason();
  const content = seasonPageContent[season];
  const isOpen = getOpenState();

  return (
    <section
      id="reserve"
      className="px-6 py-20 sm:px-8 sm:py-28 lg:px-12"
      style={{ backgroundColor: content.paper }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p
              className="text-[12px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "Abel, sans-serif", color: content.accentSoft }}
            >
              The rhythm
            </p>
            <h2
              className="mt-3 text-[40px] leading-none sm:text-[56px]"
              style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 400, color: "hsl(var(--wine-bg))" }}
            >
              Visit Tres this {season}
            </h2>
            <p
              className="mt-5 max-w-[34rem] text-[17px] leading-[1.7]"
              style={{ fontFamily: "Abel, sans-serif", color: "hsl(24 16% 28%)" }}
            >
              {content.rhythm.note}
            </p>

            <div className="mt-10 flex items-center gap-3">
              <span
                className="block h-3 w-3 rounded-full"
                style={{ backgroundColor: isOpen ? content.accent : "hsl(24 10% 55%)" }}
              />
              <span
                className="text-[11px] uppercase tracking-[0.18em]"
                style={{ fontFamily: "Abel, sans-serif", color: "hsl(24 16% 28%)" }}
              >
                {isOpen ? "Open now" : "Currently closed"}
              </span>
            </div>
          </div>

          <div className="grid gap-[3px] lg:grid-cols-[0.88fr_1.12fr]">
            <div className="border p-6 sm:p-8" style={{ borderColor: "hsl(24 12% 78%)", backgroundColor: "transparent" }}>
              <p className="text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: "Abel, sans-serif", color: content.accentSoft }}>
                Hours
              </p>
              <div className="mt-4 space-y-2">
                {content.rhythm.hours.map((line) => (
                  <p key={line} style={{ fontFamily: "Abel, sans-serif", color: "hsl(24 16% 28%)", fontSize: "16px" }}>
                    {line}
                  </p>
                ))}
              </div>

              <p className="mt-8 text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: "Abel, sans-serif", color: content.accentSoft }}>
                Address
              </p>
              <div className="mt-4 space-y-2">
                {content.rhythm.address.map((line) => (
                  <p key={line} style={{ fontFamily: "Abel, sans-serif", color: "hsl(24 16% 28%)", fontSize: "16px" }}>
                    {line}
                  </p>
                ))}
              </div>

              <p className="mt-8 text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: "Abel, sans-serif", color: content.accentSoft }}>
                Arrival
              </p>
              <p className="mt-4 text-[16px] leading-[1.7]" style={{ fontFamily: "Abel, sans-serif", color: "hsl(24 16% 28%)" }}>
                {content.rhythm.travel}
              </p>
            </div>

            <div className="grid min-h-[420px] grid-rows-[1fr_auto] border" style={{ borderColor: "hsl(24 12% 78%)" }}>
              <iframe
                title="Tres Rotterdam map"
                src="https://www.google.com/maps?q=Walhalla%20Rotterdam&z=15&output=embed"
                className="h-full w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="border-t p-6 sm:p-8" style={{ borderColor: "hsl(24 12% 78%)" }}>
                <p
                  className="text-[28px] leading-[1.12] sm:text-[34px]"
                  style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 400, color: "hsl(24 18% 16%)" }}
                >
                  {seasonQuotes[season]}
                </p>
                <a
                  href="/reserve"
                  className="mt-6 inline-flex text-[11px] uppercase tracking-[0.18em]"
                  style={{ fontFamily: "Abel, sans-serif", color: content.accentSoft }}
                >
                  Open reservation flow
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}