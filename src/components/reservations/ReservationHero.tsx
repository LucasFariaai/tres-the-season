import { motion } from "framer-motion";
import { useSeason, seasonLabels } from "@/lib/seasonContext";
import { Star, Users, Clock } from "lucide-react";

export default function ReservationHero() {
  const { season } = useSeason();

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-season-darkest season-transition">
      <div className="absolute inset-0 bg-gradient-to-b from-season-darkest/80 via-season-dark/60 to-season-darkest/90 season-transition" />

      <div className="relative z-10 text-center px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-body text-sm tracking-[0.3em] uppercase text-season-light/80 mb-4 season-transition"
        >
          {seasonLabels[season]} Season
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-4xl sm:text-6xl text-season-lightest mb-6 season-transition"
        >
          Reserve Your Table
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-accent italic text-season-light/70 text-lg max-w-md mx-auto mb-12 season-transition"
        >
          An evening shaped by the season, the river, and the land.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-8 text-season-light/60 text-sm font-body"
        >
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>4.9 rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>12K+ guests</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>~2h experience</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <div className="w-px h-12 bg-season-light/30 mx-auto animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
