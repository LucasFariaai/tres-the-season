import { useState } from "react";
import ReservationHero from "@/components/reservations/ReservationHero";
import DateTimePicker from "@/components/reservations/DateTimePicker";
import PartySizeSelector from "@/components/reservations/PartySizeSelector";
import SeatingPreference from "@/components/reservations/SeatingPreference";
import SpecialRequests from "@/components/reservations/SpecialRequests";
import ReservationSummary from "@/components/reservations/ReservationSummary";
import ConfirmationCelebration from "@/components/reservations/ConfirmationCelebration";
import SeasonBar from "@/components/SeasonBar";

export default function Reserve() {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [seating, setSeating] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [dietary, setDietary] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const canSubmit = !!date && !!time && !!seating;

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

      <div className="lg:pr-[340px]">
        <DateTimePicker
          selectedDate={date}
          selectedTime={time}
          onDateChange={setDate}
          onTimeChange={setTime}
        />

        <div className="border-t border-season-lighter season-transition" />

        <PartySizeSelector partySize={partySize} onChange={setPartySize} />

        <div className="border-t border-season-lighter season-transition" />

        <SeatingPreference selected={seating} onChange={setSeating} />

        <div className="border-t border-season-lighter season-transition" />

        <SpecialRequests
          occasion={occasion}
          dietary={dietary}
          notes={notes}
          onOccasionChange={setOccasion}
          onDietaryChange={setDietary}
          onNotesChange={setNotes}
        />

        {/* Bottom spacer for mobile bar */}
        <div className="h-24 lg:h-0" />
      </div>

      <ReservationSummary
        date={date}
        time={time}
        partySize={partySize}
        seating={seating}
        canSubmit={canSubmit}
        onSubmit={handleSubmit}
      />

      <ConfirmationCelebration
        show={confirmed}
        date={date}
        time={time}
        partySize={partySize}
        seating={seating}
        confirmationCode={confirmationCode}
      />
    </div>
  );
}
