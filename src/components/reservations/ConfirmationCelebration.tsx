import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Check, Calendar, Share2, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  show: boolean;
  date: Date | null;
  time: string | null;
  partySize: number;
  seating: string | null;
  confirmationCode: string;
}

const seatingLabels: Record<string, string> = {
  terrace: "Waterside Terrace",
  dining: "Main Dining",
  counter: "Chef's Counter",
};

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: 0, rotate: p.rotation + 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          className="absolute rounded-sm bg-season-dark season-transition"
          style={{ width: p.size, height: p.size * 0.6 }}
        />
      ))}
    </div>
  );
}

export default function ConfirmationCelebration({ show, date, time, partySize, seating, confirmationCode }: Props) {
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      setConfetti(true);
      const t = setTimeout(() => setConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-season-darkest/95 flex items-center justify-center p-6 season-transition"
        >
          {confetti && <Confetti />}

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", damping: 20 }}
            className="bg-season-lightest rounded-2xl p-8 max-w-md w-full text-center shadow-2xl season-transition"
          >
            <div className="w-16 h-16 rounded-full bg-season-dark flex items-center justify-center mx-auto mb-6 season-transition">
              <Check className="w-8 h-8 text-season-lightest" />
            </div>

            <h2 className="font-display text-3xl text-season-dark mb-2 season-transition">Confirmed</h2>
            <p className="font-body text-season-mid mb-6 season-transition">We look forward to welcoming you.</p>

            <div className="bg-season-lighter/30 rounded-xl p-5 mb-6 text-left space-y-3 font-body text-sm season-transition">
              <p className="text-season-dark">
                <strong>Code:</strong> {confirmationCode}
              </p>
              {date && (
                <p className="text-season-dark">
                  <strong>Date:</strong> {format(date, "EEEE, MMMM d, yyyy")}
                </p>
              )}
              {time && (
                <p className="text-season-dark">
                  <strong>Time:</strong> {time}
                </p>
              )}
              <p className="text-season-dark">
                <strong>Guests:</strong> {partySize}
              </p>
              {seating && (
                <p className="text-season-dark">
                  <strong>Seating:</strong> {seatingLabels[seating]}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-season-lighter text-season-dark font-body text-sm hover:bg-season-lighter/30 transition-colors season-transition">
                <Calendar className="w-4 h-4" /> Calendar
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-season-lighter text-season-dark font-body text-sm hover:bg-season-lighter/30 transition-colors season-transition">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 text-sm font-body text-season-mid hover:text-season-dark transition-colors season-transition"
            >
              <Home className="w-4 h-4" /> Return home
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
