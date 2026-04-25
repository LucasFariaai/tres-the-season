import { motion, useReducedMotion } from "framer-motion";
import type { TransitionContent } from "@/lib/site-editor/types";

type LivingMenuIntroProps = {
  content: TransitionContent;
};

export default function LivingMenuIntro({ content }: LivingMenuIntroProps) {
  const reducedMotion = useReducedMotion();

  const initial = reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 };
  const whileInView = { opacity: 1, y: 0 };

  return (
    <section
      className="flex items-center justify-center px-6 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28"
      style={{ backgroundColor: "#F5EFE6" }}
    >
      <motion.div
        className="max-w-[760px] text-center"
        initial={initial}
        whileInView={whileInView}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {content.eyebrow ? (
          <motion.p
            className="text-[11px] uppercase tracking-[0.34em]"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              color: "rgba(26,20,16,0.5)",
            }}
            initial={initial}
            whileInView={whileInView}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.eyebrow}
          </motion.p>
        ) : null}
        <motion.h2
          className="mt-5 text-[44px] leading-[1.05] sm:text-[60px] lg:text-[72px]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 400,
            color: "#1A1410",
            letterSpacing: "-0.01em",
          }}
          initial={initial}
          whileInView={whileInView}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.title}
        </motion.h2>
        {content.subtitle ? (
          <motion.p
            className="mx-auto mt-5 max-w-[560px] text-[16px] leading-[1.6] sm:text-[18px]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              color: "rgba(26,20,16,0.65)",
            }}
            initial={initial}
            whileInView={whileInView}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.subtitle}
          </motion.p>
        ) : null}
      </motion.div>
    </section>
  );
}
