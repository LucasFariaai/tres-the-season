import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { gsap } from "gsap";
import SeasonBar from "@/components/SeasonBar";
import wineList from "@/data/tres-wine-list.json";
import { cn } from "@/lib/utils";

type WineType = "sparkling" | "white" | "red";
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

type ActiveFilters = {
  types: WineType[];
  countries: string[];
  regions: string[];
  grapes: string[];
  query: string;
};

type RegionGroup = {
  key: string;
  label: string;
  wines: WineItem[];
};

type TypeSection = {
  type: WineType;
  label: string;
  wines: WineItem[];
  groups: RegionGroup[];
};

const wines = (wineList as WineItem[]).filter((wine) => ["sparkling", "white", "red"].includes(wine.type)) as WineItem[];
const FEATURED_IDS = [5, 47, 96, 111, 145, 160];
const TYPE_OPTIONS: Array<{ value: WineType; label: string }> = [
  { value: "sparkling", label: "Sparkling" },
  { value: "white", label: "White" },
  { value: "red", label: "Red" },
];
const COUNTRY_OPTIONS = ["France", "Italy", "Spain", "Germany", "Austria"];
const PRIORITY_GRAPES = ["Chardonnay", "Pinot Noir", "Nebbiolo", "Riesling"];
const TYPE_LABELS: Record<WineType, string> = {
  sparkling: "Sparkling",
  white: "White",
  red: "Red",
};
const OPEN_EASE = "cubic-bezier(0.45, 0, 0.15, 1)";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function toggleValue<T extends string>(items: T[], value: T) {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

function formatPrice(price: number) {
  return `€${price}`;
}

function formatVintage(vintage: WineItem["vintage"]) {
  return vintage === null ? "NV" : String(vintage);
}

function groupLabel(wine: WineItem) {
  return wine.subregion ? `${wine.region} / ${wine.subregion}` : wine.region;
}

function regionLabel(wine: WineItem) {
  return wine.subregion ? `${wine.region}, ${wine.subregion}` : wine.region;
}

function searchableText(wine: WineItem) {
  return [wine.producer, wine.name, wine.vintage ?? "", wine.grapes, wine.region, wine.subregion ?? "", wine.country]
    .join(" ")
    .toLowerCase();
}

function grapeOptionsFromList(list: WineItem[]) {
  const counts = new Map<string, number>();

  for (const wine of list) {
    for (const grape of wine.grapes.split(",").map((value) => value.trim())) {
      counts.set(grape, (counts.get(grape) ?? 0) + 1);
    }
  }

  const dynamic = [...counts.entries()]
    .filter(([grape, count]) => count >= 3 && !PRIORITY_GRAPES.includes(grape))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([grape]) => grape);

  return [...PRIORITY_GRAPES, ...dynamic];
}

function filterWineList(list: WineItem[], filters: ActiveFilters) {
  const query = filters.query.trim().toLowerCase();

  return list.filter((wine) => {
    if (filters.types.length > 0 && !filters.types.includes(wine.type as WineType)) return false;
    if (filters.countries.length > 0 && !filters.countries.includes(wine.country)) return false;
    if (filters.regions.length > 0 && !filters.regions.includes(groupLabel(wine))) return false;
    if (
      filters.grapes.length > 0 &&
      !filters.grapes.every((grape) => wine.grapes.toLowerCase().includes(grape.toLowerCase()))
    ) {
      return false;
    }
    if (query && !searchableText(wine).includes(query)) return false;
    return true;
  });
}

function buildSections(list: WineItem[], activeTypes: WineType[]) {
  const typesToShow = activeTypes.length > 0 ? activeTypes : TYPE_OPTIONS.map((option) => option.value);

  return typesToShow
    .map((type) => {
      const typeWines = list.filter((wine) => wine.type === type);
      const map = new Map<string, RegionGroup>();

      for (const wine of typeWines) {
        const key = groupLabel(wine);
        const existing = map.get(key);
        if (existing) {
          existing.wines.push(wine);
        } else {
          map.set(key, { key, label: key, wines: [wine] });
        }
      }

      return {
        type,
        label: TYPE_LABELS[type],
        wines: typeWines,
        groups: [...map.values()],
      } satisfies TypeSection;
    })
    .filter((section) => section.wines.length > 0);
}

function WinePill({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "wine-list-body min-h-11 border px-5 py-2 text-[13px] uppercase tracking-[0.12em] transition-colors duration-300",
        active
          ? "border-transparent bg-wine-accent text-wine-text"
          : "border-[rgba(248,239,230,0.18)] bg-transparent text-wine-text hover:border-[rgba(248,239,230,0.28)] hover:text-wine-muted",
      )}
      style={{ borderRadius: "999px" }}
    >
      {children}
    </button>
  );
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "wine-list-body whitespace-nowrap border px-4 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors duration-300",
        active
          ? "border-transparent bg-wine-accent text-wine-text"
          : "border-[rgba(248,239,230,0.12)] bg-transparent text-wine-muted hover:border-[rgba(248,239,230,0.22)] hover:text-wine-text",
      )}
      style={{ borderRadius: "999px" }}
    >
      {label}
    </button>
  );
}

function WineRow({ wine, index, showOrdinal = true }: { wine: WineItem; index: number; showOrdinal?: boolean }) {
  return (
    <article
      data-animate="row"
      className="grid items-start gap-4 border-t border-[rgba(248,239,230,0.10)] py-5 transition-[opacity,transform] duration-300 sm:grid-cols-[36px_minmax(0,1fr)_92px_70px] sm:gap-5"
    >
      <div className={cn("hidden wine-list-body text-[12px] uppercase tracking-[0.12em] text-wine-micro sm:block", !showOrdinal && "sm:invisible")}>
        {showOrdinal ? `(${String(index + 1).padStart(2, "0")})` : ""}
      </div>

      <div className="min-w-0 space-y-1">
        <p className="wine-list-body text-[11px] uppercase tracking-[0.12em] text-wine-micro">{wine.producer}</p>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3 className="wine-list-display text-[20px] text-wine-text">{wine.name}</h3>
          {wine.note ? <span className="wine-list-body text-[11px] italic text-wine-accent">{wine.note}</span> : null}
        </div>
        <p className="wine-list-body text-[13px] leading-[1.6] text-wine-micro">{wine.grapes}</p>
      </div>

      <div className="wine-list-body text-[11px] uppercase tracking-[0.12em] text-wine-micro sm:pt-1 sm:text-right">
        <p>{formatVintage(wine.vintage)}</p>
        <p className="mt-1">{regionLabel(wine)}</p>
      </div>

      <div className="wine-list-body min-w-[70px] pt-1 text-right text-[17px] text-wine-muted">{formatPrice(wine.price)}</div>
    </article>
  );
}

export default function WineListPage() {
  const [filters, setFilters] = useState<ActiveFilters>({
    types: [],
    countries: [],
    regions: [],
    grapes: [],
    query: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [hasAnimatedOpen, setHasAnimatedOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const fullListRef = useRef<HTMLElement>(null);
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationScopeRef = useRef<HTMLDivElement>(null);

  const featuredWines = useMemo(
    () => FEATURED_IDS.map((id) => wines.find((wine) => wine.id === id)).filter(Boolean) as WineItem[],
    [],
  );

  const grapeOptions = useMemo(() => grapeOptionsFromList(wines), []);

  const regionOptions = useMemo(() => {
    if (filters.countries.length === 0) return [];
    const byType = filters.types.length > 0 ? wines.filter((wine) => filters.types.includes(wine.type as WineType)) : wines;
    return [...new Set(byType.filter((wine) => filters.countries.includes(wine.country)).map((wine) => groupLabel(wine)))].sort((a, b) =>
      a.localeCompare(b),
    );
  }, [filters.countries, filters.types]);

  const filteredWines = useMemo(() => filterWineList(wines, filters), [filters]);
  const sections = useMemo(() => buildSections(filteredWines, filters.types), [filteredWines, filters.types]);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      regions: current.regions.filter((region) => regionOptions.includes(region)),
    }));
  }, [regionOptions]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (reducedMotion) {
      content.style.height = isOpen ? "auto" : "0px";
      return;
    }

    if (isOpen) {
      content.style.height = `${content.scrollHeight}px`;
      const onEnd = () => {
        if (isOpen) content.style.height = "auto";
      };
      content.addEventListener("transitionend", onEnd, { once: true });
      return () => content.removeEventListener("transitionend", onEnd);
    }

    const currentHeight = content.scrollHeight;
    content.style.height = `${currentHeight}px`;
    requestAnimationFrame(() => {
      content.style.height = "0px";
    });
  }, [isOpen, reducedMotion, sections, filteredWines.length]);

  useEffect(() => {
    if (isOpen) setHasAnimatedOpen(true);
  }, [isOpen]);

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => setIsSticky(isOpen && !entry.isIntersecting), {
      threshold: 1,
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isOpen]);

  useEffect(() => {
    const scope = animationScopeRef.current;
    if (!scope || !isOpen || reducedMotion || !hasAnimatedOpen) return;

    const ctx = gsap.context(() => {
      const headings = gsap.utils.toArray<HTMLElement>("[data-animate='heading']");
      const regions = gsap.utils.toArray<HTMLElement>("[data-animate='region']");
      const rows = gsap.utils.toArray<HTMLElement>("[data-animate='row']");

      gsap.set(headings, { opacity: 0, y: 20 });
      gsap.set(regions, { opacity: 0, y: 12 });
      gsap.set(rows, { opacity: 0 });

      const timeline = gsap.timeline({ defaults: { ease: OPEN_EASE } });
      timeline.to(headings, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 });
      timeline.to(regions, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, "<0.1");

      rows.forEach((row, index) => {
        timeline.to(row, { opacity: 1, duration: 0.4 }, `>-0.08+${Math.floor(index / 10) * 0.04}`);
      });
    }, scope);

    return () => ctx.revert();
  }, [hasAnimatedOpen, isOpen, reducedMotion, sections]);

  const openFullList = () => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      fullListRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    });
  };

  const resultCount = filteredWines.length;

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

            <div className="mt-12 flex flex-wrap gap-3">
              {TYPE_OPTIONS.map((option) => (
                <WinePill
                  key={option.value}
                  active={filters.types.includes(option.value)}
                  onClick={() => setFilters((current) => ({ ...current, types: toggleValue(current.types, option.value) }))}
                >
                  {option.label}
                </WinePill>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-10">
              <p className="wine-list-body text-[11px] uppercase tracking-[0.15em] text-wine-micro">Sommelier selection</p>
              <h2 className="wine-list-display mt-4 text-[clamp(32px,4.5vw,56px)] leading-[1.02] text-wine-text">Conversation starters.</h2>
            </div>

            <div className="grid gap-x-12 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, columnIndex) => {
                const columnItems = featuredWines.slice(columnIndex * 3, columnIndex * 3 + 3);
                return (
                  <div key={columnIndex}>
                    {columnItems.map((wine, index) => (
                      <WineRow key={wine.id} wine={wine} index={columnIndex * 3 + index} />
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={openFullList}
                className="wine-list-display text-[18px] text-wine-muted transition-colors duration-300 hover:text-wine-text hover:underline"
              >
                See the full list
              </button>
            </div>
          </div>
        </section>

        <section ref={fullListRef} className="px-5 py-20 sm:px-8 lg:px-12">
          <div ref={stickySentinelRef} className="h-px w-full" />
          <div className={cn("z-30 border-y border-[rgba(248,239,230,0.10)] bg-wine-bg", isSticky ? "fixed inset-x-0 top-0" : "sticky top-0")}>
            <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-12">
              <div className="flex min-w-0 flex-1 flex-col gap-4 lg:pr-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <input
                    value={filters.query}
                    onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                    placeholder="Search producer, wine, vintage..."
                    className="wine-list-body h-11 w-full max-w-full border border-[rgba(248,239,230,0.15)] bg-[rgba(248,239,230,0.05)] px-4 text-[15px] text-wine-text outline-none placeholder:text-wine-muted sm:max-w-[320px]"
                    style={{ borderRadius: "4px" }}
                  />
                  <p className="wine-list-body text-[11px] uppercase tracking-[0.12em] text-wine-micro">Showing {resultCount} wines</p>
                </div>

                <div className="space-y-3 overflow-hidden">
                  <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
                    {TYPE_OPTIONS.map((option) => (
                      <WinePill
                        key={option.value}
                        active={filters.types.includes(option.value)}
                        onClick={() => setFilters((current) => ({ ...current, types: toggleValue(current.types, option.value) }))}
                      >
                        {option.label}
                      </WinePill>
                    ))}
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {COUNTRY_OPTIONS.map((country) => (
                      <FilterChip
                        key={country}
                        label={country}
                        active={filters.countries.includes(country)}
                        onClick={() => setFilters((current) => ({ ...current, countries: toggleValue(current.countries, country) }))}
                      />
                    ))}
                  </div>

                  {regionOptions.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {regionOptions.map((region) => (
                        <FilterChip
                          key={region}
                          label={region}
                          active={filters.regions.includes(region)}
                          onClick={() => setFilters((current) => ({ ...current, regions: toggleValue(current.regions, region) }))}
                        />
                      ))}
                    </div>
                  ) : null}

                  <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {grapeOptions.map((grape) => (
                      <FilterChip
                        key={grape}
                        label={grape}
                        active={filters.grapes.includes(grape)}
                        onClick={() => setFilters((current) => ({ ...current, grapes: toggleValue(current.grapes, grape) }))}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 lg:pt-1">
                <div className="hidden flex-wrap gap-3 lg:flex">
                  {TYPE_OPTIONS.map((option) => (
                    <WinePill
                      key={option.value}
                      active={filters.types.includes(option.value)}
                      onClick={() => setFilters((current) => ({ ...current, types: toggleValue(current.types, option.value) }))}
                    >
                      {option.label}
                    </WinePill>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen((current) => !current)}
                  className="ml-auto flex h-11 w-11 items-center justify-center text-wine-micro transition-colors duration-300 hover:text-wine-text"
                  aria-label={isOpen ? "Collapse full wine list" : "Expand full wine list"}
                >
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div
            ref={contentRef}
            className="overflow-hidden"
            style={{
              height: 0,
              opacity: isOpen ? 1 : 0,
              transition: reducedMotion ? "opacity 0.01s linear" : `height 600ms ${OPEN_EASE}, opacity 300ms linear`,
            }}
          >
            <div ref={animationScopeRef} className="mx-auto max-w-[1400px] pt-10">
              {isOpen ? (
                sections.length > 0 ? (
                  <div className="space-y-16">
                    {sections.map((section) => (
                      <section key={section.type} className="space-y-8">
                        <div data-animate="heading">
                          <p className="wine-list-body text-[11px] uppercase tracking-[0.15em] text-wine-micro">
                            {section.wines.length} {section.wines.length === 1 ? "bottle" : "bottles"}
                          </p>
                          <h2 className="wine-list-display mt-3 text-[clamp(36px,5vw,64px)] leading-[1] text-wine-text">{section.label}</h2>
                        </div>

                        <div className="space-y-12">
                          {section.groups.map((group) => (
                            <div key={group.key} className="space-y-4">
                              <div data-animate="region" className="flex items-center gap-4 pt-3">
                                <div className="h-px flex-1 bg-[rgba(248,239,230,0.10)]" />
                                <p className="wine-list-body shrink-0 text-[12px] uppercase tracking-[0.15em] text-wine-micro">{group.label}</p>
                              </div>

                              <div>
                                {group.wines.map((wine, index) => (
                                  <WineRow key={wine.id} wine={wine} index={index} showOrdinal={false} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[240px] items-center justify-center text-center">
                    <p className="wine-list-display text-[20px] text-wine-muted">
                      Nothing in the cellar matches. Try adjusting the filters.
                    </p>
                  </div>
                )
              ) : null}
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
