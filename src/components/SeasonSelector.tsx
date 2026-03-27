import { useState, useEffect } from "react";
import { useSeason, seasonLabels, type Season } from "@/lib/seasonContext";
import { motion, AnimatePresence } from "framer-motion";

import foodTableSpread from "@/assets/food-table-spread.jpg";
import foodCotton from "@/assets/food-cotton.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodDryage from "@/assets/food-dryage.jpg";

const allSeasons: Season[] = ["spring", "summer", "autumn", "winter"];

const seasonImages: Record<Season, string> = {
  spring: foodCotton,
  summer: foodTableSpread,
  autumn: foodDessert,
  winter: foodDryage,
};

const seasonDescriptionsShort: Record<Season, string> = {
  spring: "First growth, wild garlic, elderflower",
  summer: "Stone fruit, langoustine, edible flowers",
  autumn: "Wild game, porcini, fermented berries",
  winter: "Smoked eel, black truffle, bone marrow",
};

export default function SeasonSelector() {
  const { season, setSeason } = useSeason();
  const [animatedIn, setAnimatedIn] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    allSeasons.forEach((_, i) => {
      timers.push(
        setTimeout(() => setAnimatedIn((prev) => [...prev, i]), 180 * i)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden py-20 sm:py-28"
      style={{ backgroundColor: "#1A1410" }}
    >
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16 px-6">
        <p
          className="font-body text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: "#8B7355" }}
        >
          The Seasons
        </p>
        <h2
          className="font-display italic text-3xl sm:text-4xl mb-3"
          style={{ color: "#F7F3ED" }}
        >
          A living menu
        </h2>
        <p
          className="font-accent text-base max-w-md mx-auto"
          style={{ color: "#B8B0A3" }}
        >
          Each season reshapes the entire experience. Choose one to explore.
        </p>
      </div>

      {/* Selector row */}
      <div className="flex flex-row gap-3 sm:gap-4 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto h-[400px] sm:h-[450px] lg:h-[500px]">
        {allSeasons.map((s, index) => {
          const isActive = s === season;
          const hasAnimated = animatedIn.includes(index);

          return (
            <motion.button
              key={s}
              onClick={() => setSeason(s)}
              className="relative overflow-hidden rounded-sm"
              style={{
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateX(0)" : "translateX(-60px)",
                transition: "opacity 0.6s ease, transform 0.6s ease, flex 0.6s cubic-bezier(0.32, 0.72, 0, 1)",
                flex: isActive ? 4 : 1,
              }}
            >
              {/* Shadow overlay */}
              <div
                className="absolute inset-0 z-[1]"
                style={{
                  background: isActive
                    ? "linear-gradient(to top, rgba(26,20,16,0.7) 0%, rgba(26,20,16,0.1) 50%, transparent 100%)"
                    : "linear-gradient(to top, rgba(26,20,16,0.85) 0%, rgba(26,20,16,0.4) 100%)",
                  transition: "background 0.6s ease",
                }}
              />

              {/* Image */}
              <img
                src={seasonImages[s]}
                alt={`${seasonLabels[s]} at Tres`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: isActive ? "none" : "grayscale(30%) brightness(0.7)",
                  transition: "filter 0.6s ease, transform 0.6s ease",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
                loading="lazy"
              />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 z-[2] p-4 sm:p-6 text-left">
                <p
                  className="font-display text-lg sm:text-xl tracking-wide"
                  style={{ color: "#F7F3ED" }}
                >
                  {seasonLabels[s]}
                </p>

                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="font-accent text-[13px] sm:text-[14px] mt-1"
                      style={{ color: "#B8B0A3" }}
                    >
                      {seasonDescriptionsShort[s]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="season-indicator"
                  className="absolute top-4 right-4 z-[3] w-2 h-2 rounded-full"
                  style={{ backgroundColor: "hsl(var(--season-mid))" }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
