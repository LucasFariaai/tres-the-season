import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import chefImg from "@/assets/chef-kitchen.jpg";
import foundersImg from "@/assets/founders-cellar.jpg";

export default function ConceptSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-season-darkest overflow-hidden season-transition"
    >
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-28 sm:py-40">
        {/* Top: philosophy text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mb-20 sm:mb-28"
        >
          <p className="font-body text-xs tracking-[0.4em] uppercase text-season-mid/60 mb-5 season-transition">
            Our Philosophy
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-season-lightest leading-tight mb-8 season-transition">
            Complex without<br />being complicated.
          </h2>
          <p className="font-body text-base sm:text-lg text-season-light/60 leading-relaxed season-transition">
            Tres is built on a simple conviction: the finest ingredients, treated with
            restraint and respect, need very little else. Every dish begins in the land
            and ends at the table — nothing more, nothing less.
          </p>
        </motion.div>

        {/* Two-image grid with parallax */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Left: Chef image — taller */}
          <motion.div style={{ y: y1 }} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl"
            >
              <img
                src={chefImg}
                alt="Chef preparing dishes in the candlelit kitchen"
                className="w-full aspect-[3/4] object-cover"
              />
              {/* Warm overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-season-darkest/50 via-transparent to-transparent season-transition" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mt-6 sm:mt-8"
            >
              <h3 className="font-display text-xl sm:text-2xl text-season-lightest mb-3 season-transition">
                The Hands
              </h3>
              <p className="font-body text-sm text-season-light/50 leading-relaxed max-w-sm season-transition">
                Every course is shaped by intuition, not formula. Our kitchen works with
                what the season brings — adapting, improvising, discovering flavour in
                restraint.
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Founders image — offset down */}
          <motion.div style={{ y: y2 }} className="md:mt-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl"
            >
              <img
                src={foundersImg}
                alt="The founders in the historic cellar of Tres"
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-season-darkest/50 via-transparent to-transparent season-transition" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-6 sm:mt-8"
            >
              <h3 className="font-display text-xl sm:text-2xl text-season-lightest mb-3 season-transition">
                The Place
              </h3>
              <p className="font-body text-sm text-season-light/50 leading-relaxed max-w-sm season-transition">
                Set inside a 19th-century cellar beneath the Walhalla, where the Maas
                meets the city. Stone walls, candlelight, and the quiet hum of a kitchen
                at work — this is where Tres lives.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-24 sm:mt-32 text-center"
        >
          <div className="w-px h-16 bg-season-mid/20 mx-auto mb-8 season-transition" />
          <p className="font-accent italic text-lg sm:text-xl text-season-light/40 max-w-lg mx-auto season-transition">
            "We don't chase trends. We chase seasons."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
