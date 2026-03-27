import { useRef } from "react";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";

const timeSlots = [
  { time: "18:00", popular: false },
  { time: "18:30", popular: false },
  { time: "19:00", popular: true },
  { time: "19:30", popular: true },
  { time: "20:00", popular: true },
  { time: "20:30", popular: false },
  { time: "21:00", popular: false },
  { time: "21:30", popular: false },
];

interface Props {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (d: Date) => void;
  onTimeChange: (t: string) => void;
}

export default function DateTimePicker({ selectedDate, selectedTime, onDateChange, onTimeChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

  const getDateLabel = (d: Date) => {
    if (isToday(d)) return "Today";
    if (isTomorrow(d)) return "Tomorrow";
    return format(d, "EEE");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-16 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <CalendarDays className="w-5 h-5 text-season-mid season-transition" />
          <h2 className="font-display text-2xl text-season-dark season-transition">Choose a Date</h2>
        </div>

        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
          {dates.map((d) => {
            const isSelected = selectedDate && format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            return (
              <button
                key={d.toISOString()}
                onClick={() => onDateChange(d)}
                className={`flex-shrink-0 flex flex-col items-center px-5 py-4 rounded-xl border transition-all duration-300 min-w-[80px] ${
                  isSelected
                    ? "bg-season-dark text-season-lightest border-season-dark shadow-lg scale-105"
                    : "bg-season-lightest/50 text-season-dark border-season-lighter hover:border-season-mid hover:shadow-sm"
                } season-transition`}
              >
                <span className="text-xs font-body uppercase tracking-wider opacity-70">
                  {getDateLabel(d)}
                </span>
                <span className="text-2xl font-display mt-1">{format(d, "d")}</span>
                <span className="text-xs font-body mt-1 opacity-60">{format(d, "MMM")}</span>
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-season-mid season-transition" />
              <h3 className="font-display text-xl text-season-dark season-transition">Select a Time</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {timeSlots.map(({ time, popular }) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => onTimeChange(time)}
                    className={`relative py-4 px-3 rounded-xl border text-center transition-all duration-300 ${
                      isSelected
                        ? "bg-season-dark text-season-lightest border-season-dark shadow-lg"
                        : "bg-season-lightest/50 text-season-dark border-season-lighter hover:border-season-mid"
                    } season-transition`}
                  >
                    <span className="font-body text-lg font-medium">{time}</span>
                    {popular && !isSelected && (
                      <span className="absolute top-1.5 right-2 text-[10px] font-body text-season-mid season-transition">
                        popular
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
