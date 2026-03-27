import { format, addDays } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
  const tomorrow = addDays(new Date(), 1);
  const maxDate = addDays(new Date(), 30);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="w-5 h-5 text-season-mid season-transition" />
        <h2 className="font-display text-2xl text-season-dark season-transition">Choose a Date</h2>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-body h-14 rounded-2xl border-white/20 bg-white/10 backdrop-blur-md text-season-dark hover:bg-white/20 hover:text-season-dark season-transition",
              !selectedDate && "text-season-mid"
            )}
          >
            <CalendarDays className="mr-3 h-5 w-5 text-season-mid" />
            {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
          <Calendar
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={(d) => d && onDateChange(d)}
            disabled={(date) => date < tomorrow || date > maxDate}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-8"
        >
          <div className="flex items-center gap-3 mb-4">
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
                  className={`relative py-4 px-3 rounded-2xl border text-center transition-all duration-300 ${
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
    </motion.div>
  );
}
