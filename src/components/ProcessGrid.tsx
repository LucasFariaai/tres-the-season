import { motion, useReducedMotion } from "framer-motion";
import { seasonPageContent, useSeason } from "@/lib/seasonContext";

export default function ProcessGrid() {
  const { season } = useSeason();
  const reducedMotion = useReducedMotion();
  const content = seasonPageContent[season];

  return (
    <section className="px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p
            className="text-[12px] uppercase tracking-[0.18em]"
            style={{ fontFamily: "'Source Sans 3', sans-serif", color: content.accent }}
          >
            The process
          </p>
          <h2
            className="mt-3 text-[40px] leading-none sm:text-[56px]"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, color: content.ink }}
          >
            How the season is handled
          </h2>
        </div>

        <div className="mt-12 grid gap-[3px] lg:grid-cols-3">
          {content.process.map((item, index) => (
            <motion.article
              key={item.title}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.7, delay: reducedMotion ? 0 : index * 0.08 }}
              className="grid min-h-[520px] grid-rows-[1fr_auto] overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="border-t px-0 py-5" style={{ borderColor: content.line }}>
                <p
                  className="text-[11px] uppercase tracking-[0.18em]"
                  style={{ fontFamily: "'Source Sans 3', sans-serif", color: content.accent }}
                >
                  {item.title}
                </p>
                <p
                  className="mt-3 max-w-[22rem] text-[16px] leading-[1.7]"
                  style={{ fontFamily: "'Source Sans 3', sans-serif", color: content.muted }}
                >
                  {item.caption}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}