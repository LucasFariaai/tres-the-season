import { useState } from "react";
import ReservationHero from "@/components/reservations/ReservationHero";
import DateTimePicker from "@/components/reservations/DateTimePicker";
import PartySizeSelector from "@/components/reservations/PartySizeSelector";
import ReservationSummary from "@/components/reservations/ReservationSummary";
import ConfirmationCelebration from "@/components/reservations/ConfirmationCelebration";
import SeasonBar from "@/components/SeasonBar";

export default function Reserve() {
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
    <div className="min-h-screen bg-background season-transition">
      <SeasonBar />

      <ReservationHero />

      <div className="px-4 sm:px-6 py-12 flex justify-center">
        <div className="w-full max-w-2xl bg-season-lightest/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-10 season-transition">
          <DateTimePicker
            selectedDate={date}
            selectedTime={time}
            onDateChange={setDate}
            onTimeChange={setTime}
          />

          <div className="border-t border-white/10 my-2" />

          <PartySizeSelector partySize={partySize} onChange={setPartySize} />
        </div>
      </div>

      <ReservationSummary
        date={date}
        time={time}
        partySize={partySize}
        canSubmit={canSubmit}
        onSubmit={handleSubmit}
      />

      <ConfirmationCelebration
        show={confirmed}
        date={date}
        time={time}
        partySize={partySize}
        confirmationCode={confirmationCode}
      />
    </div>
  );
}
