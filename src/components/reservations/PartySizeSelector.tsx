import { motion } from "framer-motion";
import { Users, Minus, Plus } from "lucide-react";

interface Props {
  partySize: number;
  onChange: (n: number) => void;
}

const quickSizes = [1, 2, 4, 6, 8];

export default function PartySizeSelector({ partySize, onChange }: Props) {
  const progress = Math.min(partySize / 10, 1);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - progress * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-5 h-5 text-season-mid season-transition" />
        <h2 className="font-display text-2xl text-season-dark season-transition">Table for</h2>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="3"
              className="stroke-season-lighter season-transition" />
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="3"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round"
              className="stroke-season-dark season-transition transition-all duration-500" />
          </svg>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onChange(Math.max(1, partySize - 1))}
              className="w-8 h-8 rounded-full border border-season-lighter flex items-center justify-center text-season-mid hover:bg-season-lighter/50 transition-colors season-transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-display text-4xl text-season-dark season-transition min-w-[2ch] text-center">
              {partySize}
            </span>
            <button
              onClick={() => onChange(Math.min(12, partySize + 1))}
              className="w-8 h-8 rounded-full border border-season-lighter flex items-center justify-center text-season-mid hover:bg-season-lighter/50 transition-colors season-transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          {quickSizes.map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={`w-12 h-12 rounded-full font-body text-sm transition-all duration-300 ${
                partySize === n
                  ? "bg-season-dark text-season-lightest shadow-lg"
                  : "bg-season-lightest/50 text-season-dark border border-season-lighter hover:border-season-mid"
              } season-transition`}
            >
              {n}
            </button>
          ))}
        </div>

        {partySize >= 8 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-body text-season-mid text-center season-transition"
          >
            For parties of 8+, we recommend our private dining experience.
            <br />
            <span className="text-season-dark">Contact us directly for arrangements.</span>
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
