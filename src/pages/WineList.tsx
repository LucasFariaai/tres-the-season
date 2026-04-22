import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SeasonBar from "@/components/SeasonBar";
import wineList from "@/data/tres-wine-list.json";
import { cn } from "@/lib/utils";

type WineType = "sparkling" | "white" | "red";
type FilterType = WineType | "all";

type WineItem = {
  id: number;
  type: "sparkling" | "white" | "red" | "dessert";
  country: string;
  region: string;
  subregion: string | null;
  vintage: number | string | null;
  name: string;
  producer: string;
  grapes: string;
  price: number;
  note?: string;
};

type FilterState = {
  query: string;
  activeType: FilterType;
  priceFrom: string;
  priceTo: string;
};

type WineGroup = {
  key: string;
  label: string;
  wines: WineItem[];
};

type WineSection = {
  type: WineType;
  label: string;
  groups: WineGroup[];
};

const wines = (wineList as WineItem[]).filter((wine) => ["sparkling", "white", "red"].includes(wine.type)) as WineItem[];
const FEATURED_IDS = [5, 47, 96, 111, 145, 160];
const TYPE_OPTIONS: Array<{ value: FilterType; label: string }> = [
  { value: "all", label: "All" },
  { value: "sparkling", label: "Sparkling" },
  { value: "white", label: "White" },
  { value: "red", label: "Red" },
];
const TYPE_LABELS: Record<WineType, string> = {
  sparkling: "Sparkling",
  white: "White",
  red: "Red",
};
const TYPE_ORDER: Record<WineType, number> = {
  sparkling: 0,
  white: 1,
  red: 2,
};
const DEFAULT_PRICE_FROM = 75;
const DEFAULT_PRICE_TO = 950;
const REVEAL_EASE = [0.45, 0, 0.15, 1] as const;

function normalizeText(value: string | number | null | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatVintage(vintage: WineItem["vintage"]) {
  return vintage === null ? "NV" : String(vintage);
}

function formatPrice(price: number) {
  return String(price);
}

function formatRegionLine(wine: WineItem) {
  return wine.subregion ? `${wine.region} · ${wine.subregion}` : wine.region;
}

function formatGroupLabel(wine: WineItem) {
  return [wine.country, wine.region, wine.subregion].filter(Boolean).join(" · ").toUpperCase();
}

function parsePriceInput(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function compareWines(a: WineItem, b: WineItem) {
  return (
    TYPE_ORDER[a.type as WineType] - TYPE_ORDER[b.type as WineType] ||
    a.country.localeCompare(b.country) ||
    a.region.localeCompare(b.region) ||
    (a.subregion ?? "").localeCompare(b.subregion ?? "") ||
    a.producer.localeCompare(b.producer) ||
    a.name.localeCompare(b.name) ||
    a.price - b.price
  );
}

function scoreWineRelevance(wine: WineItem, query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return -1;

  const name = normalizeText(wine.name);
  const producer = normalizeText(wine.producer);
  const grapes = normalizeText(wine.grapes);
  const region = normalizeText(wine.region);
  const subregion = normalizeText(wine.subregion);
  const country = normalizeText(wine.country);

  let score = 0;

  if (name === normalizedQuery) score = Math.max(score, 1200);
  else if (name.startsWith(normalizedQuery)) score = Math.max(score, 1050);
  else if (name.includes(normalizedQuery)) score = Math.max(score, 900);

  if (producer === normalizedQuery) score = Math.max(score, 850);
  else if (producer.startsWith(normalizedQuery)) score = Math.max(score, 760);
  else if (producer.includes(normalizedQuery)) score = Math.max(score, 680);

  if (grapes.includes(normalizedQuery)) score = Math.max(score, 560);
  if (subregion && subregion.includes(normalizedQuery)) score = Math.max(score, 500);
  if (region.includes(normalizedQuery)) score = Math.max(score, 470);
  if (country.includes(normalizedQuery)) score = Math.max(score, 430);

  return score;
}

function buildBrowsingSections(list: WineItem[]) {
  return (Object.keys(TYPE_LABELS) as WineType[])
    .map((type) => {
      const typeWines = list.filter((wine) => wine.type === type).sort(compareWines);
      const groupsMap = new Map<string, WineGroup>();

      typeWines.forEach((wine) => {
        const key = `${wine.country}::${wine.region}::${wine.subregion ?? ""}`;
        const existing = groupsMap.get(key);
        if (existing) {
          existing.wines.push(wine);
          return;
        }

        groupsMap.set(key, {
          key,
          label: formatGroupLabel(wine),
          wines: [wine],
        });
      });

      return {
        type,
        label: TYPE_LABELS[type],
        groups: [...groupsMap.values()],
      } satisfies WineSection;
    })
    .filter((section) => section.groups.length > 0);
}

function filterByControls(list: WineItem[], filters: FilterState) {
  const normalizedQuery = normalizeText(filters.query);
  const from = parsePriceInput(filters.priceFrom, DEFAULT_PRICE_FROM);
  const to = parsePriceInput(filters.priceTo, DEFAULT_PRICE_TO);
  const minPrice = Math.min(from, to);
  const maxPrice = Math.max(from, to);

  return list.filter((wine) => {
    if (filters.activeType !== "all" && wine.type !== filters.activeType) return false;
    if (wine.price < minPrice || wine.price > maxPrice) return false;

    if (!normalizedQuery) return true;

    return [wine.name, wine.producer, wine.grapes, wine.region, wine.subregion ?? "", wine.country]
      .map(normalizeText)
      .some((field) => field.includes(normalizedQuery));
  });
}

function useReveal(disabled: boolean) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(disabled || reducedMotion);

  useEffect(() => {
    if (disabled || reducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled, reducedMotion]);

  return { ref, isVisible, reducedMotion };
}

function RevealBlock({
  children,
  className,
  delay = 0,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  disabled: boolean;
}) {
  const { ref, isVisible, reducedMotion } = useReveal(disabled);

  return (
    <div
      ref={ref}
      className={cn("wine-list-reveal", isVisible && "is-visible", className)}
      style={
        reducedMotion || disabled
          ? undefined
          : {
              transitionDuration: "600ms",
              transitionDelay: `${delay}ms`,
              transitionTimingFunction: "cubic-bezier(0.45, 0, 0.15, 1)",
            }
      }
    >
      {children}
    </div>
  );
}

function HighlightRow({ wine, index }: { wine: WineItem; index: number }) {
  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-5 border-b border-[hsl(var(--wine-text)/0.06)] py-5">
      <div className="min-w-0">
          <div className="flex items-start gap-4">
          <span className="wine-list-body pt-0.5 text-[13px] text-[hsl(var(--wine-muted)/0.25)]">({String(index + 1).padStart(2, "0")})</span>
          <div className="min-w-0 space-y-1">
            <p className="wine-list-body text-[11px] uppercase tracking-[0.1em] text-[hsl(var(--wine-muted)/0.5)]">{wine.producer}</p>
            <h3 className="wine-list-display text-[20px] text-wine-text">{wine.name}</h3>
            <p className="wine-list-body text-[12px] italic text-[hsl(var(--wine-muted)/0.4)]">{wine.grapes}</p>
          </div>
        </div>
      </div>

      <div className="min-w-[82px] text-right">
        <p className="wine-list-body text-[13px] text-wine-muted">{formatVintage(wine.vintage)}</p>
        <p className="mt-1 wine-list-body text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--wine-muted)/0.3)]">{formatRegionLine(wine)}</p>
        <p className="wine-list-display-roman mt-3 text-[20px] text-wine-text">{formatPrice(wine.price)}</p>
      </div>
    </article>
  );
}

function CategoryTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "wine-list-body border-b-2 pb-2 text-[12px] uppercase tracking-[0.12em] transition-colors duration-300",
        active
          ? "border-[hsl(var(--wine-accent))] text-wine-text"
          : "border-transparent text-[hsl(var(--wine-muted)/0.4)] hover:text-[hsl(var(--wine-muted)/0.72)]",
      )}
    >
      {label}
    </button>
  );
}

function WineListRow({ wine }: { wine: WineItem }) {
  return (
    <article className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 border-b border-[hsl(var(--wine-text)/0.04)] py-3 transition-colors duration-300 hover:bg-[hsl(var(--wine-text)/0.02)] md:grid-cols-[40px_minmax(0,1fr)_minmax(96px,140px)_auto]">
      <div className="wine-list-body text-[13px] text-[hsl(var(--wine-muted)/0.4)]">{formatVintage(wine.vintage)}</div>

      <div className="min-w-0 space-y-0.5">
        <h4 className="wine-list-body truncate text-[15px] font-medium text-wine-text sm:whitespace-normal">{wine.name}</h4>
        <p className="wine-list-body text-[12px] text-[hsl(var(--wine-muted)/0.45)]">{wine.producer}</p>
        <p className="wine-list-body text-[11px] italic text-[hsl(var(--wine-muted)/0.3)]">{wine.grapes}</p>
      </div>

      <div className="hidden text-right md:block">
        <p className="wine-list-body text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--wine-muted)/0.2)]">{formatRegionLine(wine)}</p>
      </div>

      <div className="wine-list-display-roman text-right text-[16px] text-wine-muted">{formatPrice(wine.price)}</div>
    </article>
  );
}

function BrowsingGroup({
  group,
  expanded,
  onToggle,
  disableReveal,
}: {
  group: WineGroup;
  expanded: boolean;
  onToggle: () => void;
  disableReveal: boolean;
}) {
  const needsToggle = group.wines.length > 5;
  const visibleWines = needsToggle && !expanded ? group.wines.slice(0, 5) : group.wines;

  return (
    <div className="space-y-2">
      <RevealBlock disabled={disableReveal} delay={200}>
        <p className="wine-list-body mt-8 text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--wine-muted)/0.3)] first:mt-0">{group.label}</p>
      </RevealBlock>

      <motion.div
        layout
        initial={false}
        animate={disableReveal ? undefined : { opacity: 1 }}
        className="overflow-hidden"
        transition={{ duration: 0.3, ease: REVEAL_EASE }}
      >
        {visibleWines.map((wine) => (
          <WineListRow key={wine.id} wine={wine} />
        ))}
      </motion.div>

      {needsToggle ? (
        <button
          type="button"
          onClick={onToggle}
          className="wine-list-body pt-2 text-[12px] text-wine-accent transition-opacity duration-300 hover:opacity-80"
        >
          {expanded ? "Show less" : `Show all ${group.wines.length}`}
        </button>
      ) : null}
    </div>
  );
}

export default function WineListPage() {
  const reducedMotion = useReducedMotion();
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    activeType: "all",
    priceFrom: String(DEFAULT_PRICE_FROM),
    priceTo: String(DEFAULT_PRICE_TO),
  });
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const featuredWines = useMemo(
    () => FEATURED_IDS.map((id) => wines.find((wine) => wine.id === id)).filter(Boolean) as WineItem[],
    [],
  );

  const normalizedQuery = normalizeText(filters.query);
  const numericPriceFrom = parsePriceInput(filters.priceFrom, DEFAULT_PRICE_FROM);
  const numericPriceTo = parsePriceInput(filters.priceTo, DEFAULT_PRICE_TO);
  const isSearching = normalizedQuery.length > 0 || filters.activeType !== "all" || numericPriceFrom !== DEFAULT_PRICE_FROM || numericPriceTo !== DEFAULT_PRICE_TO;

  const visibleWines = useMemo(() => filterByControls(wines, filters), [filters]);

  const browsingSections = useMemo(() => buildBrowsingSections(wines), []);

  const flatResults = useMemo(() => {
    const results = [...visibleWines];

    if (!normalizedQuery) {
      return results.sort(compareWines);
    }

    return results.sort((a, b) => {
      const scoreDifference = scoreWineRelevance(b, normalizedQuery) - scoreWineRelevance(a, normalizedQuery);
      if (scoreDifference !== 0) return scoreDifference;
      return compareWines(a, b);
    });
  }, [normalizedQuery, visibleWines]);

  const resultCount = isSearching ? flatResults.length : wines.length;

  return (
    <div className="wine-list-theme min-h-screen bg-wine-bg text-wine-text">
      <SeasonBar />

      <main className="relative overflow-x-clip bg-wine-bg text-wine-text">
        <section className="px-5 pb-20 pt-[120px] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <p className="wine-list-body text-[11px] uppercase tracking-[0.15em] text-wine-micro">WINE LIST · 2026</p>
            <h1 className="wine-list-display mt-5 max-w-5xl text-[clamp(48px,7vw,96px)] leading-[1] text-wine-text">
              A collection of gems.
            </h1>
            <p className="wine-list-display mt-6 max-w-3xl text-[clamp(18px,2.5vw,28px)] leading-[1.1] text-wine-muted">
              Something for everyone and many personal favorites.
            </p>
          </div>
        </section>

        <motion.section
          initial={false}
          animate={
            reducedMotion
              ? { opacity: isSearching ? 0 : 1, height: isSearching ? 0 : "auto" }
              : { opacity: isSearching ? 0 : 1, height: isSearching ? 0 : "auto", marginBottom: isSearching ? 0 : 0 }
          }
          transition={{ duration: isSearching ? 0.3 : 0.4, ease: REVEAL_EASE }}
          className="overflow-hidden px-[8%] pb-16"
          aria-hidden={isSearching}
          style={{ backgroundColor: "hsl(var(--wine-bg))", pointerEvents: isSearching ? "none" : "auto" }}
        >
          <div className="mx-auto max-w-[1400px]">
            <p className="wine-list-body mb-4 text-[12px] uppercase tracking-[0.18em] text-wine-accent">SOMMELIER SELECTION</p>
            <h2 className="wine-list-display mb-12 text-[clamp(36px,5vw,56px)] text-wine-text">Conversation starters.</h2>

            <div className="grid gap-x-12 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, columnIndex) => {
                const items = featuredWines.slice(columnIndex * 3, columnIndex * 3 + 3);
                return (
                  <div key={columnIndex}>
                    {items.map((wine, index) => (
                      <HighlightRow key={wine.id} wine={wine} index={columnIndex * 3 + index} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <section className="bg-wine-bg px-[8%] pb-[120px] pt-0">
          <div className="mx-auto max-w-[1400px]">
            <div
              className={cn(
                "z-30 transition-all duration-[400ms]",
                isSearching
                  ? "sticky top-0 -mx-[8%] border-b border-[hsl(var(--wine-text)/0.06)] bg-[hsl(var(--wine-bg)/0.95)] px-[8%] py-4 backdrop-blur-[12px]"
                  : "relative py-0",
              )}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="w-full md:max-w-[320px] md:flex-none">
                  <label htmlFor="wine-list-search" className="sr-only">
                    Search wines
                  </label>
                  <input
                    id="wine-list-search"
                    type="text"
                    value={filters.query}
                    onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                    placeholder="Search by producer, wine, grape or region..."
                    className="wine-list-body h-[38px] w-full border-0 border-b border-[hsl(var(--wine-text)/0.15)] bg-transparent px-0 py-[10px] text-[14px] text-wine-text outline-none placeholder:text-[hsl(var(--wine-muted)/0.3)]"
                  />
                </div>

                <div className="flex flex-wrap items-end gap-x-5 gap-y-3 md:justify-center">
                  {TYPE_OPTIONS.map((option) => (
                    <CategoryTab
                      key={option.value}
                      label={option.label}
                      active={filters.activeType === option.value}
                      onClick={() => setFilters((current) => ({ ...current, activeType: option.value }))}
                    />
                  ))}
                </div>

                <div className="flex items-end gap-6 md:ml-auto md:self-end">
                  <div className="hidden items-end gap-3 md:flex">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={filters.priceFrom}
                      onChange={(event) => {
                        const nextValue = event.target.value.replace(/[^0-9]/g, "");
                        setFilters((current) => ({ ...current, priceFrom: nextValue }));
                      }}
                      className="wine-input-number wine-list-body h-[34px] w-[60px] border-0 border-b border-[hsl(var(--wine-text)/0.15)] bg-transparent px-0 text-center text-[13px] text-wine-muted outline-none"
                      aria-label="Minimum price"
                    />
                    <span className="wine-list-body pb-1 text-[11px] text-[hsl(var(--wine-muted)/0.3)]">to</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={filters.priceTo}
                      onChange={(event) => {
                        const nextValue = event.target.value.replace(/[^0-9]/g, "");
                        setFilters((current) => ({ ...current, priceTo: nextValue }));
                      }}
                      className="wine-input-number wine-list-body h-[34px] w-[60px] border-0 border-b border-[hsl(var(--wine-text)/0.15)] bg-transparent px-0 text-center text-[13px] text-wine-muted outline-none"
                      aria-label="Maximum price"
                    />
                  </div>

                  <p className="wine-list-body whitespace-nowrap pb-1 text-[11px] text-[hsl(var(--wine-muted)/0.25)]">{resultCount} wines</p>
                </div>
              </div>
            </div>

            <div className="pt-10">
              <div className="mb-3 grid grid-cols-[40px_minmax(0,1fr)_auto] items-end gap-x-4 md:grid-cols-[40px_minmax(0,1fr)_minmax(96px,140px)_auto]">
                <span className="wine-list-body text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--wine-muted)/0.18)]">Vint</span>
                <span className="wine-list-body text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--wine-muted)/0.18)]">Wine</span>
                <span className="hidden wine-list-body text-right text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--wine-muted)/0.18)] md:block">Region</span>
                <span className="wine-list-body text-right text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--wine-muted)/0.18)]">€</span>
              </div>

              <div className="relative">
                <motion.div
                  initial={false}
                  animate={
                    reducedMotion
                      ? { opacity: isSearching ? 0 : 1, height: isSearching ? 0 : "auto" }
                      : { opacity: isSearching ? 0 : 1, height: isSearching ? 0 : "auto" }
                  }
                  transition={{ duration: 0.4, ease: REVEAL_EASE }}
                  className="overflow-hidden"
                  aria-hidden={isSearching}
                  style={{ pointerEvents: isSearching ? "none" : "auto" }}
                >
                  <div className="space-y-10">
                    {browsingSections.map((section, sectionIndex) => (
                      <section key={section.type} className={cn(sectionIndex > 0 && "pt-6")}>
                        <RevealBlock disabled={isSearching || reducedMotion}>
                          <h3 className={cn("wine-list-display mb-6 text-[clamp(32px,4vw,48px)] text-wine-text", sectionIndex > 0 && "mt-16")}>
                            {section.label}
                          </h3>
                        </RevealBlock>

                        <div>
                          {section.groups.map((group) => {
                            const expanded = Boolean(expandedGroups[group.key]);
                            return (
                              <BrowsingGroup
                                key={group.key}
                                group={group}
                                expanded={expanded}
                                disableReveal={isSearching || reducedMotion}
                                onToggle={() =>
                                  setExpandedGroups((current) => ({
                                    ...current,
                                    [group.key]: !current[group.key],
                                  }))
                                }
                              />
                            );
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={false}
                  animate={
                    reducedMotion
                      ? { opacity: isSearching ? 1 : 0, height: isSearching ? "auto" : 0 }
                      : { opacity: isSearching ? 1 : 0, height: isSearching ? "auto" : 0 }
                  }
                  transition={{ duration: 0.4, ease: REVEAL_EASE }}
                  className="overflow-hidden"
                  aria-hidden={!isSearching}
                  style={{ pointerEvents: isSearching ? "auto" : "none" }}
                >
                  <AnimatePresence initial={false} mode="wait">
                    {isSearching ? (
                      <motion.div
                        key="search-results"
                        initial={reducedMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={reducedMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {flatResults.length > 0 ? (
                          <div>
                            {flatResults.map((wine) => (
                              <WineListRow key={wine.id} wine={wine} />
                            ))}
                          </div>
                        ) : (
                          <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                            <p className="wine-list-display text-[24px] font-light text-[hsl(var(--wine-muted)/0.4)]">No wines found</p>
                            <p className="wine-list-body mt-3 text-[13px] text-[hsl(var(--wine-muted)/0.25)]">Try broadening your search</p>
                          </div>
                        )}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[rgba(248,239,230,0.08)] px-5 py-12 text-center sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1400px] space-y-2">
            <p className="wine-list-body text-[13px] text-wine-micro">Prices are subject to change. Wine list 2026.</p>
            <p className="wine-list-body text-[13px] text-wine-micro">Ask your sommelier for the current selection by the glass.</p>
            <p className="pt-6">
              <Link to="/" className="wine-list-display text-[18px] text-wine-muted transition-colors duration-300 hover:text-wine-text hover:underline">
                Return to Tres
              </Link>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
