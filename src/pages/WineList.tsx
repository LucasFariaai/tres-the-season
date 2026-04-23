import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SeasonBar from "@/components/SeasonBar";
import { wines, type Wine, type WineCategory } from "@/data/tres-wine-data";

/* ─── constants ──────────────────────────────────────────────────────── */

const CATEGORY_ORDER: WineCategory[] = ["sparkling", "white", "red", "dessert"];
const CATEGORY_LABELS: Record<WineCategory, string> = {
  sparkling: "Sparkling",
  white: "White wine",
  red: "Red wine",
  dessert: "Dessert",
};
const CATEGORY_SHORT: Record<WineCategory, string> = {
  sparkling: "Sparkling",
  white: "White",
  red: "Red",
  dessert: "Dessert",
};

/* ─── helpers ────────────────────────────────────────────────────────── */

function normalize(value: string | number | null | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function regionKey(wine: Wine): string {
  return [wine.country, wine.region, wine.subregion ?? ""].join("::");
}

function regionLabel(wine: Wine): string {
  const parts = [wine.country, wine.region];
  if (wine.subregion) parts.push(wine.subregion);
  return parts.join(" · ").toUpperCase();
}

/** Returns indices [start, length] of first match, or null */
function findMatch(text: string, query: string): [number, number] | null {
  if (!query) return null;
  const idx = normalize(text).indexOf(normalize(query));
  if (idx === -1) return null;
  return [idx, query.length];
}

/** Check if wine matches the query across all searchable fields */
function wineMatches(wine: Wine, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);

  // exact price match only
  if (/^\d+$/.test(q) && String(wine.price) === q) return true;

  return [
    wine.name,
    wine.producer,
    wine.grapes,
    wine.region,
    wine.subregion ?? "",
    wine.country,
    wine.category,
    wine.vintage ?? "",
  ].some((field) => normalize(field).includes(q));
}

/* ─── data structures ────────────────────────────────────────────────── */

interface WineGroup {
  key: string;
  label: string;
  wines: Wine[];
}

interface WineSection {
  category: WineCategory;
  label: string;
  id: string;
  groups: WineGroup[];
}

function buildSections(list: Wine[]): WineSection[] {
  return CATEGORY_ORDER.map((cat) => {
    const catWines = list.filter((w) => w.category === cat);
    const groupMap = new Map<string, WineGroup>();

    catWines.forEach((w) => {
      const key = regionKey(w);
      const existing = groupMap.get(key);
      if (existing) {
        existing.wines.push(w);
      } else {
        groupMap.set(key, { key, label: regionLabel(w), wines: [w] });
      }
    });

    return {
      category: cat,
      label: CATEGORY_LABELS[cat],
      id: `section-${cat}`,
      groups: [...groupMap.values()],
    };
  }).filter((s) => s.groups.length > 0);
}

/* ─── highlight component ────────────────────────────────────────────── */

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const match = findMatch(text, query);
  if (!match) return <>{text}</>;

  const [start, length] = match;
  return (
    <>
      {text.slice(0, start)}
      <span style={{ color: "#C17D3E" }}>{text.slice(start, start + length)}</span>
      {text.slice(start + length)}
    </>
  );
}

/* ─── wine row ───────────────────────────────────────────────────────── */

function WineRow({ wine, query }: { wine: Wine; query: string }) {
  const vintage = wine.vintage ?? "NV";

  return (
    <>
      {/* Desktop */}
      <div
        className="hidden md:grid items-baseline gap-x-4 border-b py-[10px] transition-colors duration-200 hover:bg-[rgba(245,239,230,0.02)]"
        style={{
          gridTemplateColumns: "50px 1fr 200px 160px 70px",
          borderColor: "rgba(245,239,230,0.04)",
        }}
      >
        <span
          className="text-right"
          style={{ fontFamily: "Abel, sans-serif", fontSize: "13px", color: "rgba(200,184,154,0.35)" }}
        >
          {vintage}
        </span>
        <span style={{ fontFamily: "Abel, sans-serif", fontSize: "15px", fontWeight: 500, color: "#F5EFE6" }}>
          <Highlight text={wine.name} query={query} />
        </span>
        <span
          className="text-right truncate"
          style={{ fontFamily: "Abel, sans-serif", fontSize: "13px", color: "rgba(200,184,154,0.4)" }}
        >
          <Highlight text={wine.producer} query={query} />
        </span>
        <span
          className="text-right truncate italic"
          style={{ fontFamily: "Abel, sans-serif", fontSize: "12px", color: "rgba(200,184,154,0.25)" }}
        >
          <Highlight text={wine.grapes} query={query} />
        </span>
        <span
          className="text-right"
          style={{ fontFamily: "Abel, sans-serif", fontSize: "15px", fontWeight: 500, color: "#C8B89A" }}
        >
          €{wine.price}
        </span>
      </div>

      {/* Mobile */}
      <div
        className="md:hidden border-b py-[12px]"
        style={{ borderColor: "rgba(245,239,230,0.04)" }}
      >
        <div className="flex justify-between items-baseline">
          <span style={{ fontFamily: "Abel, sans-serif", fontSize: "14px", fontWeight: 500, color: "#F5EFE6" }}>
            <span style={{ color: "rgba(200,184,154,0.35)", fontSize: "13px", marginRight: "6px" }}>{vintage}</span>
            <Highlight text={wine.name} query={query} />
          </span>
          <span style={{ fontFamily: "Abel, sans-serif", fontSize: "14px", fontWeight: 500, color: "#C8B89A", flexShrink: 0, marginLeft: "12px" }}>
            €{wine.price}
          </span>
        </div>
        <div className="truncate" style={{ fontFamily: "Abel, sans-serif", fontSize: "12px", color: "rgba(200,184,154,0.4)", marginTop: "2px" }}>
          <Highlight text={wine.producer} query={query} />
          <span style={{ margin: "0 6px", color: "rgba(200,184,154,0.2)" }}>·</span>
          <span className="italic" style={{ color: "rgba(200,184,154,0.25)" }}>
            <Highlight text={wine.grapes} query={query} />
          </span>
        </div>
      </div>
    </>
  );
}

/* ─── sommelier highlights ───────────────────────────────────────────── */

function SommelierHighlights() {
  const featured = useMemo(() => wines.filter((w) => w.featured), []);

  if (featured.length === 0) return null;

  return (
    <div style={{ padding: "0 0 48px" }}>
      <p
        style={{
          fontFamily: "Abel, sans-serif",
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#C17D3E",
          marginBottom: "12px",
        }}
      >
        Conversation starters
      </p>
      <p
        style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "18px",
          color: "rgba(200,184,154,0.45)",
          marginBottom: "32px",
        }}
      >
        A few wines we think deserve attention this season.
      </p>
      <div className="grid gap-x-12 md:grid-cols-2">
        {featured.slice(0, 6).map((wine) => (
          <div
            key={wine.id}
            className="border-b py-4"
            style={{ borderColor: "rgba(245,239,230,0.06)" }}
          >
            <p style={{ fontFamily: "Abel, sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(200,184,154,0.4)" }}>
              {wine.producer}
            </p>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: 400, color: "#F5EFE6", marginTop: "4px" }}>
              {wine.name}
            </p>
            <div className="flex justify-between items-baseline mt-2">
              <span className="italic" style={{ fontFamily: "Abel, sans-serif", fontSize: "12px", color: "rgba(200,184,154,0.3)" }}>
                {wine.grapes}
              </span>
              <span style={{ fontFamily: "Abel, sans-serif", fontSize: "15px", color: "#C8B89A" }}>
                €{wine.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── side index (desktop) ───────────────────────────────────────────── */

function SideIndex({
  sections,
  activeCategory,
  visible,
}: {
  sections: WineSection[];
  activeCategory: WineCategory | null;
  visible: boolean;
}) {
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <nav
      className="hidden lg:flex fixed left-6 top-1/2 z-30 flex-col items-start gap-4"
      style={{ transform: "translateY(-50%)" }}
      aria-label="Wine list sections"
    >
      {sections.map((section) => {
        const isActive = activeCategory === section.category;
        return (
          <button
            key={section.category}
            type="button"
            onClick={() => scrollTo(section.id)}
            style={{
              fontFamily: "Abel, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: isActive ? "#F5EFE6" : "rgba(200,184,154,0.2)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 200ms ease",
              padding: 0,
            }}
          >
            {CATEGORY_SHORT[section.category]}
          </button>
        );
      })}
    </nav>
  );
}

/* ─── sticky category bar (mobile) ───────────────────────────────────── */

function MobileCategoryBar({
  sections,
  activeCategory,
  visible,
}: {
  sections: WineSection[];
  activeCategory: WineCategory | null;
  visible: boolean;
}) {
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <div
      className="lg:hidden sticky z-10"
      style={{
        top: 0,
        background: "rgba(26,20,16,0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "12px 24px",
      }}
    >
      <div className="flex items-center gap-6">
        {sections.map((section) => {
          const isActive = activeCategory === section.category;
          return (
            <button
              key={section.category}
              type="button"
              onClick={() => scrollTo(section.id)}
              style={{
                fontFamily: "Abel, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isActive ? "#F5EFE6" : "rgba(200,184,154,0.35)",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid #C17D3E" : "2px solid transparent",
                cursor: "pointer",
                transition: "color 200ms ease, border-color 200ms ease",
                paddingBottom: "4px",
              }}
            >
              {CATEGORY_SHORT[section.category]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── main page ──────────────────────────────────────────────────────── */

export default function WineListPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<WineCategory | null>(null);
  const [showNav, setShowNav] = useState(false);

  const headerRefs = useRef<Map<WineCategory, HTMLElement | null>>(new Map());
  const firstHeaderRef = useRef<HTMLElement | null>(null);

  const isSearching = query.trim().length > 0;
  const normalizedQuery = normalize(query);

  // Build full sections (unfiltered)
  const allSections = useMemo(() => buildSections(wines), []);

  // Filtered view when searching
  const filteredWines = useMemo(() => {
    if (!isSearching) return [];
    return wines.filter((w) => wineMatches(w, normalizedQuery));
  }, [isSearching, normalizedQuery]);

  const resultCount = isSearching ? filteredWines.length : wines.length;

  // Track active category via IntersectionObserver
  useEffect(() => {
    const elements = Array.from(headerRefs.current.entries())
      .map(([cat, el]) => (el ? { cat, el } : null))
      .filter(Boolean) as { cat: WineCategory; el: HTMLElement }[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cat = (entry.target as HTMLElement).dataset.category as WineCategory;
            if (cat) setActiveCategory(cat);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.01 },
    );

    elements.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, [allSections]);

  // Show/hide nav based on scroll past first header
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNav(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    const el = firstHeaderRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [allSections]);

  const setHeaderRef = useCallback(
    (cat: WineCategory, el: HTMLElement | null) => {
      headerRefs.current.set(cat, el);
      if (cat === CATEGORY_ORDER[0]) firstHeaderRef.current = el;
    },
    [],
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1410", color: "#F5EFE6" }}>
      <SeasonBar />

      <main className="relative">
        {/* Hero */}
        <section className="px-6 pb-16 pt-[120px] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <p
              style={{
                fontFamily: "Abel, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(200,184,154,0.25)",
              }}
            >
              Wine list · 2026
            </p>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(42px, 7vw, 80px)",
                lineHeight: 1,
                color: "#F5EFE6",
                marginTop: "20px",
              }}
            >
              The carta.
            </h1>
          </div>
        </section>

        {/* Sommelier highlights */}
        <section className="px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <SommelierHighlights />
          </div>
        </section>

        {/* Search bar */}
        <section className="px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <div className="relative" style={{ maxWidth: "480px", margin: "0 auto 0 0" }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Krug, Nebbiolo, Burgundy, red..."
                aria-label="Search wines by name, producer, grape, region, or vintage"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "1px solid rgba(245,239,230,0.15)",
                  padding: "14px 40px 14px 20px",
                  fontFamily: "Abel, sans-serif",
                  fontSize: "15px",
                  color: "#F5EFE6",
                  outline: "none",
                  borderRadius: 0,
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    fontFamily: "Abel, sans-serif",
                    fontSize: "14px",
                    color: "rgba(200,184,154,0.4)",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            <p
              className="text-right"
              style={{
                fontFamily: "Abel, sans-serif",
                fontSize: "11px",
                color: "rgba(200,184,154,0.2)",
                marginTop: "8px",
              }}
            >
              {resultCount} wines
            </p>
          </div>
        </section>

        {/* Navigation */}
        <SideIndex sections={allSections} activeCategory={activeCategory} visible={showNav && !isSearching} />
        <MobileCategoryBar sections={allSections} activeCategory={activeCategory} visible={showNav && !isSearching} />

        {/* Wine list body */}
        <section className="px-6 pt-8 pb-[120px] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            {/* Search results mode */}
            {isSearching ? (
              <div>
                <p
                  style={{
                    fontFamily: "Abel, sans-serif",
                    fontSize: "12px",
                    color: "rgba(200,184,154,0.3)",
                    marginBottom: "16px",
                  }}
                >
                  Showing {filteredWines.length} results for &lsquo;{query}&rsquo;
                </p>

                {filteredWines.length > 0 ? (
                  filteredWines.map((wine) => (
                    <WineRow key={wine.id} wine={wine} query={normalizedQuery} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontStyle: "italic",
                        fontWeight: 300,
                        fontSize: "22px",
                        color: "rgba(200,184,154,0.35)",
                      }}
                    >
                      No wines match &lsquo;{query}&rsquo;
                    </p>
                    <p
                      style={{
                        fontFamily: "Abel, sans-serif",
                        fontSize: "13px",
                        color: "rgba(200,184,154,0.2)",
                        marginTop: "8px",
                      }}
                    >
                      Try a grape, region, or producer name
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Full carta mode */
              <div>
                {allSections.map((section) => (
                  <div key={section.category} className="mb-12">
                    {/* Category header */}
                    <h2
                      id={section.id}
                      data-category={section.category}
                      ref={(el) => setHeaderRef(section.category, el)}
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: "clamp(28px, 4vw, 42px)",
                        color: "#F5EFE6",
                        padding: "48px 0 16px",
                        borderBottom: "1px solid rgba(245,239,230,0.06)",
                      }}
                    >
                      {section.label}
                    </h2>

                    {/* Region groups */}
                    {section.groups.map((group) => (
                      <div key={group.key}>
                        <p
                          style={{
                            fontFamily: "Abel, sans-serif",
                            fontSize: "11px",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "rgba(200,184,154,0.25)",
                            padding: "32px 0 12px",
                          }}
                        >
                          {group.label}
                        </p>
                        {group.wines.map((wine) => (
                          <WineRow key={wine.id} wine={wine} query="" />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer
          className="px-6 py-12 text-center sm:px-8 lg:px-12"
          style={{ borderTop: "1px solid rgba(245,239,230,0.06)" }}
        >
          <div className="mx-auto max-w-[1100px] space-y-2">
            <p style={{ fontFamily: "Abel, sans-serif", fontSize: "13px", color: "rgba(200,184,154,0.2)" }}>
              Prices are subject to change. Wine list 2026.
            </p>
            <p style={{ fontFamily: "Abel, sans-serif", fontSize: "13px", color: "rgba(200,184,154,0.2)" }}>
              Ask your sommelier for the current selection by the glass.
            </p>
            <p className="pt-6">
              <Link
                to="/"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "18px",
                  color: "rgba(200,184,154,0.5)",
                  textDecoration: "none",
                  transition: "color 300ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F5EFE6")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(200,184,154,0.5)")}
              >
                Return to Tres
              </Link>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
