import { motion } from "framer-motion";
import { Waves, UtensilsCrossed, ChefHat } from "lucide-react";

const options = [
  {
    id: "terrace",
    label: "Waterside Terrace",
    description: "Views of the Maas, open air when the season allows.",
    icon: Waves,
  },
  {
    id: "dining",
    label: "Main Dining",
    description: "Intimate indoor setting, warm and candlelit.",
    icon: UtensilsCrossed,
  },
  {
    id: "counter",
    label: "Chef's Counter",
    description: "Watch the kitchen at work, six seats only.",
    icon: ChefHat,
  },
];

interface Props {
  selected: string | null;
  onChange: (id: string) => void;
}

export default function SeatingPreference({ selected, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-16 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-2xl text-season-dark mb-8 season-transition">
          Seating Preference
        </h2>

        <div className="grid gap-4">
          {options.map(({ id, label, description, icon: Icon }) => {
            const isSelected = selected === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`flex items-start gap-5 p-6 rounded-xl border text-left transition-all duration-300 ${
                  isSelected
                    ? "bg-season-dark/5 border-season-dark shadow-sm"
                    : "bg-season-lightest/30 border-season-lighter hover:border-season-mid"
                } season-transition`}
              >
                <div className={`p-3 rounded-full transition-colors duration-300 ${
                  isSelected ? "bg-season-dark text-season-lightest" : "bg-season-lighter text-season-mid"
                } season-transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-season-dark season-transition">{label}</h3>
                  <p className="font-body text-sm text-season-mid mt-1 season-transition">{description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
