import { useState } from "react";
import { useSeason, seasonLabels } from "@/lib/seasonContext";
import DateTimePicker from "@/components/reservations/DateTimePicker";
import PartySizeSelector from "@/components/reservations/PartySizeSelector";
import ConfirmationCelebration from "@/components/reservations/ConfirmationCelebration";

export default function ReserveSection() {
  const { season } = useSeason();
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const canSubmit = !!date && !!time;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const code = "TRES-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setConfirmationCode(code);
    setConfirmed(true);
  };

  return (
    <section id="reserve" className="bg-background season-transition py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-season-mid mb-4 season-transition">
              The Rhythm
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-season-dark mb-8 season-transition">
              Visit Tres
            </h2>

            <div className="space-y-6 font-body text-foreground">
              <div>
                <h3 className="font-display text-lg text-season-dark mb-2 season-transition">Hours</h3>
                <p className="text-sm text-muted-foreground">Wednesday – Saturday</p>
                <p className="text-sm text-muted-foreground">18:00 – 23:00</p>
              </div>

              <div>
                <h3 className="font-display text-lg text-season-dark mb-2 season-transition">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Walhalla, Veerhaven 1<br />
                  3011 BK Rotterdam<br />
                  The Netherlands
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg text-season-dark mb-2 season-transition">Getting here</h3>
                <p className="text-sm text-muted-foreground">
                  Take the watertaxi from Rotterdam harbour.<br />
                  A seven-minute crossing across the Maas.
                </p>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="flex flex-col justify-center">
            <div
              className="rounded-3xl p-6 sm:p-8 season-transition"
              style={{
                backgroundColor: "rgba(247, 243, 237, 0.1)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
              }}
            >
              <p className="font-accent text-lg text-season-dark mb-1 season-transition">
                {seasonLabels[season]} Tasting Menu
              </p>
              <p className="font-display text-3xl text-season-darkest mb-6 season-transition">€185</p>

              <DateTimePicker
                selectedDate={date}
                selectedTime={time}
                onDateChange={setDate}
                onTimeChange={setTime}
              />

              <div className="border-t border-white/10 my-2" />

              <PartySizeSelector partySize={partySize} onChange={setPartySize} />

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`mt-6 w-full py-4 rounded-2xl font-body text-sm tracking-widest uppercase transition-all duration-300 ${
                  canSubmit
                    ? "bg-season-dark text-season-lightest hover:bg-season-darkest shadow-lg"
                    : "bg-season-lighter/30 text-season-mid cursor-not-allowed"
                } season-transition`}
              >
                Reserve
              </button>

              <p className="text-xs text-season-mid mt-4 text-center season-transition">
                Reservations recommended 2–3 weeks ahead
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationCelebration
        show={confirmed}
        date={date}
        time={time}
        partySize={partySize}
        confirmationCode={confirmationCode}
      />
    </section>
  );
}
