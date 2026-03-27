import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users, MapPin } from "lucide-react";

interface Props {
  date: Date | null;
  time: string | null;
  partySize: number;
  seating: string | null;
  canSubmit: boolean;
  onSubmit: () => void;
}

const seatingLabels: Record<string, string> = {
  terrace: "Waterside Terrace",
  dining: "Main Dining",
  counter: "Chef's Counter",
};

export default function ReservationSummary({ date, time, partySize, seating, canSubmit, onSubmit }: Props) {
  const steps = [
    { done: !!date && !!time, label: "Date & Time" },
    { done: partySize > 0, label: "Party Size" },
    { done: !!seating, label: "Seating" },
  ];
  const progress = steps.filter((s) => s.done).length / steps.length;

  return (
    <>
      {/* Desktop sticky card */}
      <div className="hidden lg:block fixed top-24 right-8 w-[300px] z-40">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-season-lightest/80 backdrop-blur-md border border-season-lighter rounded-2xl p-6 shadow-xl season-transition"
        >
          <h3 className="font-display text-lg text-season-dark mb-4 season-transition">Your Reservation</h3>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-season-lighter rounded-full mb-6 overflow-hidden season-transition">
            <div
              className="h-full bg-season-dark rounded-full transition-all duration-500 season-transition"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="space-y-4 text-sm font-body">
            {date && (
              <div className="flex items-center gap-3 text-season-dark season-transition">
                <CalendarDays className="w-4 h-4 text-season-mid" />
                <span>{format(date, "EEE, MMM d")}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-3 text-season-dark season-transition">
                <Clock className="w-4 h-4 text-season-mid" />
                <span>{time}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-season-dark season-transition">
              <Users className="w-4 h-4 text-season-mid" />
              <span>{partySize} {partySize === 1 ? "guest" : "guests"}</span>
            </div>
            {seating && (
              <div className="flex items-center gap-3 text-season-dark season-transition">
                <MapPin className="w-4 h-4 text-season-mid" />
                <span>{seatingLabels[seating]}</span>
              </div>
            )}
          </div>

          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`mt-6 w-full py-3.5 rounded-xl font-body text-sm tracking-widest uppercase transition-all duration-300 ${
              canSubmit
                ? "bg-season-dark text-season-lightest hover:bg-season-darkest shadow-lg"
                : "bg-season-lighter text-season-mid cursor-not-allowed"
            } season-transition`}
          >
            Confirm Reservation
          </button>
        </motion.div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-season-lightest/90 backdrop-blur-md border-t border-season-lighter p-4 season-transition">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-body text-season-mid season-transition">
              {date && <span>{format(date, "MMM d")}</span>}
              {time && <span>· {time}</span>}
              <span>· {partySize}p</span>
              {seating && <span>· {seatingLabels[seating]?.split(" ")[0]}</span>}
            </div>
            <div className="w-full h-1 bg-season-lighter rounded-full mt-2 overflow-hidden season-transition">
              <div
                className="h-full bg-season-dark rounded-full transition-all duration-500 season-transition"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`px-6 py-3 rounded-xl font-body text-sm tracking-wider uppercase flex-shrink-0 transition-all ${
              canSubmit
                ? "bg-season-dark text-season-lightest"
                : "bg-season-lighter text-season-mid cursor-not-allowed"
            } season-transition`}
          >
            Book
          </button>
        </div>
      </div>
    </>
  );
}
