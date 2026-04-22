import { motion, useReducedMotion } from "framer-motion";
import { seasonLabels, seasonMenus, seasonPageContent, useSeason } from "@/lib/seasonContext";

export default function MenuPoemSection() {
  const { season } = useSeason();
  const reducedMotion = useReducedMotion();
  const content = seasonPageContent[season];
  const menu = seasonMenus[season];

  return (
    <section id="menu" className="relative overflow-hidden px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p
            className="text-[12px] uppercase tracking-[0.18em]"
            style={{ fontFamily: "Abel, sans-serif", color: content.accent }}
          >
            {seasonLabels[season]}
          </p>
          <h1
            className="mt-3 text-[44px] leading-none sm:text-[60px]"
            style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 400, color: content.ink }}
          >
            A season in motion
          </h1>
          <p
            className="mt-5 max-w-[34rem] text-[17px] leading-[1.7] sm:text-[18px]"
            style={{ fontFamily: "Abel, sans-serif", color: content.muted }}
          >
            {content.strapline}
          </p>

          <div className="mt-10 space-y-3">
            {content.poem.map((line, index) => (
              <motion.p
                key={line}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: reducedMotion ? 0 : index * 0.08 }}
                className="text-[26px] leading-[1.12] sm:text-[32px]"
                style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 400, color: content.ink }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <div className="mt-10 border-t pt-6" style={{ borderColor: content.line }}>
            <p
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "Abel, sans-serif", color: content.accent }}
            >
              Featured dish
            </p>
            <p
              className="mt-3 text-[28px] leading-[1.1] sm:text-[36px]"
              style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 400, color: content.ink }}
            >
              {content.featuredDish.title}
            </p>
            <p
              className="mt-3 max-w-[30rem] text-[16px] leading-[1.7]"
              style={{ fontFamily: "Abel, sans-serif", color: content.muted }}
            >
              {content.featuredDish.description}
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="grid gap-[3px] bg-[hsl(var(--wine-bg))] sm:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[420px] overflow-hidden sm:min-h-[540px]">
              <img
                src={content.featuredDish.image}
                alt={content.featuredDish.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="grid gap-[3px]">
              {content.galleryImages.slice(0, 2).map((image, index) => (
                <div key={image} className="relative min-h-[208px] overflow-hidden sm:min-h-[268px]">
                  <img
                    src={image}
                    alt={`${seasonLabels[season]} detail ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.18em]"
                style={{ fontFamily: "Abel, sans-serif", color: content.accent }}
              >
                Ingredient line-up
              </p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
                {content.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="text-[24px] leading-none sm:text-[30px]"
                    style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 400, color: content.ink }}
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-6" style={{ borderColor: content.line }}>
              <p
                className="text-[11px] uppercase tracking-[0.18em]"
                style={{ fontFamily: "Abel, sans-serif", color: content.accent }}
              >
                Tasting sequence
              </p>
              <div className="mt-5 space-y-4">
                {menu.items.map((item, index) => (
                  <div key={`${season}-${item}`} className="grid gap-2 border-b pb-4 sm:grid-cols-[56px_1fr]" style={{ borderColor: content.line }}>
                    <span style={{ fontFamily: "Abel, sans-serif", color: content.accent }} className="text-[11px] tracking-[0.18em]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p
                        className="text-[28px] leading-[1.08] sm:text-[32px]"
                        style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 400, color: content.ink }}
                      >
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}