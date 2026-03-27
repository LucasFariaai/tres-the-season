import { motion } from "framer-motion";
import { Heart, Leaf, MessageSquare } from "lucide-react";

const occasions = ["Birthday", "Anniversary", "Date Night", "Business", "Celebration", "Other"];
const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Nut allergy", "Pescatarian"];

interface Props {
  occasion: string | null;
  dietary: string[];
  notes: string;
  onOccasionChange: (o: string | null) => void;
  onDietaryChange: (d: string[]) => void;
  onNotesChange: (n: string) => void;
}

export default function SpecialRequests({
  occasion, dietary, notes,
  onOccasionChange, onDietaryChange, onNotesChange
}: Props) {
  const toggleDietary = (item: string) => {
    onDietaryChange(
      dietary.includes(item)
        ? dietary.filter((d) => d !== item)
        : [...dietary, item]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-16 px-6"
    >
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Occasion */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-5 h-5 text-season-mid season-transition" />
            <h2 className="font-display text-2xl text-season-dark season-transition">Special Occasion?</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {occasions.map((o) => (
              <button
                key={o}
                onClick={() => onOccasionChange(occasion === o ? null : o)}
                className={`px-5 py-2.5 rounded-full text-sm font-body transition-all duration-300 ${
                  occasion === o
                    ? "bg-season-dark text-season-lightest shadow-md"
                    : "bg-season-lightest/50 text-season-dark border border-season-lighter hover:border-season-mid"
                } season-transition`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="w-5 h-5 text-season-mid season-transition" />
            <h2 className="font-display text-2xl text-season-dark season-transition">Dietary Needs</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {dietaryOptions.map((d) => (
              <button
                key={d}
                onClick={() => toggleDietary(d)}
                className={`px-5 py-2.5 rounded-full text-sm font-body transition-all duration-300 ${
                  dietary.includes(d)
                    ? "bg-season-dark text-season-lightest shadow-md"
                    : "bg-season-lightest/50 text-season-dark border border-season-lighter hover:border-season-mid"
                } season-transition`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-5 h-5 text-season-mid season-transition" />
            <h2 className="font-display text-2xl text-season-dark season-transition">Additional Notes</h2>
          </div>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Any other requests or things we should know..."
            rows={4}
            className="w-full rounded-xl border border-season-lighter bg-season-lightest/30 px-5 py-4 font-body text-sm text-season-dark placeholder:text-season-mid/50 focus:outline-none focus:border-season-mid transition-colors season-transition resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
