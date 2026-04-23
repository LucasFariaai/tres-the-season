import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SeasonBar from "@/components/SeasonBar";
import { wines, type Wine, type WineCategory } from "@/data/tres-wine-data";

/* ── constants ───────────────────────────────────────────────────────── */

const CATEGORY_ORDER: WineCategory[] = ["sparkling", "white", "red", "dessert"];

const CATEGORY_LABELS: Record<WineCategory, string> = {
  sparkling: "Sparkling",
  white: "White wine",
  red: "Red wine",
  dessert: "Dessert",
};

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sparkling", label: "Sparkling" },
  { value: "white", label: "White" },
  { value: "red", label: "Red" },
  { value: "dessert", label: "Dessert" },
];

/* ── helpers ─────────────────────────────────────────────────────────── */

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

function wineMatches(wine: Wine, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);
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

/* ── data structures ─────────────────────────────────────────────────── */

interface WineGroup {
  key: string;
  category: WineCategory;
  label: string;
  wines: Wine[];
}

function buildGrouped(list: Wine[]): WineGroup[] {
  const map = new Map<string, WineGroup>();

  list.forEach((w) => {
    const key = `${w.category}::${regionKey(w)}`;
    const existing = map.get(key);
    if (existing) {
      existing.wines.push(w);
    } else {
      map.set(key, {
        key,
        category: w.category,
        label: regionLabel(w),
        wines: [w],
      });
    }
  });

  const order: Record<string, number> = { sparkling: 0, white: 1, red: 2, dessert: 3 };
  return Array.from(map.values()).sort((a, b) => order[a.category] - order[b.category]);
}

/* ── highlight ───────────────────────────────────────────────────────── */

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = normalize(text).indexOf(normalize(query));
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: "#C17D3E" }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ── wine row ────────────────────────────────────────────────────────── */

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
        <span className="text-right" style={{ fontFamily: "Abel, sans-serif", fontSize: "13px", color: "rgba(200,184,154,0.35)" }}>
          {vintage}
        </span>
        <span style={{ fontFamily: "Abel, sans-serif", fontSize: "15px", fontWeight: 500, color: "#F5EFE6" }}>
          <Highlight text={wine.name} query={query} />
        </span>
        <span className="text-right truncate" style={{ fontFamily: "Abel, sans-serif", fontSize: "13px", color: "rgba(200,184,154,0.4)" }}>
          <Highlight text={wine.producer} query={query} />
        </span>
        <span className="text-right truncate italic" style={{ fontFamily: "Abel, sans-serif", fontSize: "12px", color: "rgba(200,184,154,0.25)" }}>
          <Highlight text={wine.grapes} query={query} />
        </span>
        <span className="text-right" style={{ fontFamily: "Abel, sans-serif", fontSize: "15px", fontWeight: 500, color: "#C8B89A" }}>
          €{wine.price}
        </span>
      </div>

      {/* Mobile */}
      <div className="md:hidden border-b py-[12px]" style={{ borderColor: "rgba(245,239,230,0.04)" }}>
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
          <span style={{ margin: "0 6px", color: "rgba(200,184,154,0.15)" }}>·</span>
          <span className="italic" style={{ color: "rgba(200,184,154,0.25)" }}>
            <Highlight text={wine.grapes} query={query} />
          </span>
        </div>
      </div>
    </>
  );
}

/* ── sommelier highlights ────────────────────────────────────────────── */

function SommelierHighlights() {
  const featured = useMemo(() => wines.filter((w) => w.featured), []);
  if (featured.length === 0) return null;

  return (
    <div style={{ padding: "0 0 48px" }}>
      <p style={{ fontFamily: "Abel, sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C17D3E", marginBottom: "12px" }}>
        Conversation starters
      </p>
      <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300, fontSize: "18px", color: "rgba(200,184,154,0.45)", marginBottom: "32px" }}>
        A few wines we think deserve attention this season.
      </p>
      <div className="grid gap-x-12 md:grid-cols-2">
        {featured.slice(0, 6).map((wine) => (
          <div key={wine.id} className="border-b py-4" style={{ borderColor: "rgba(245,239,230,0.06)" }}>
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

/* ── main page ───────────────────────────────────────────────────────── */

export default function WineListPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCountry, setActiveCountry] = useState("all");

  const normalizedQuery = normalize(query);

  const countryOptions = useMemo(() => {
    const set = new Set(wines.map((w) => w.country));
    return ["all", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    return wines.filter((w) => {
      if (activeCategory !== "all" && w.category !== activeCategory) return false;
      if (activeCountry !== "all" && w.country !== activeCountry) return false;
      return wineMatches(w, normalizedQuery);
    });
  }, [activeCategory, activeCountry, normalizedQuery]);

  const grouped = useMemo(() => buildGrouped(filtered), [filtered]);

  const activeFilters =
    (activeCategory !== "all" ? 1 : 0) +
    (activeCountry !== "all" ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const clearAll = useCallback(() => {
    setQuery("");
    setActiveCategory("all");
    setActiveCountry("all");
  }, []);

  let lastRenderedCategory: string | null = null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1410", color: "#F5EFE6" }}>
      <SeasonBar />

      <main className="relative">
        {/* Hero */}
        <section className="px-6 pb-16 pt-[120px] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <p style={{ fontFamily: "Abel, sans-serif", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,184,154,0.25)" }}>
              Wine list · 2026
            </p>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(42px, 7vw, 80px)", lineHeight: 1, color: "#F5EFE6", marginTop: "20px" }}>
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

        {/* Sticky filter bar */}
        <div
          className="sticky top-0 z-30 px-6 sm:px-8 lg:px-12"
          style={{
            backgroundColor: "rgba(26,20,16,0.97)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="mx-auto max-w-[1100px]">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Krug, Nebbiolo, Burgundy, red..."
                aria-label="Search wines by name, producer, grape, region, or vintage"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "1px solid rgba(245,239,230,0.12)",
                  padding: "12px 40px 12px 16px",
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
                    right: "12px",
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

            {/* Category tabs */}
            <div className="flex" style={{ marginTop: "14px", overflowX: "auto" }}>
              {CATEGORY_OPTIONS.map((opt) => {
                const isActive = activeCategory === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setActiveCategory(opt.value)}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: isActive ? "2px solid #C17D3E" : "2px solid transparent",
                      padding: "8px 16px",
                      fontFamily: "Abel, sans-serif",
                      fontSize: "12px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: isActive ? "#F5EFE6" : "rgba(200,184,154,0.35)",
                      cursor: "pointer",
                      transition: "color 200ms, border-color 200ms",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Country pills */}
            <div className="flex gap-2" style={{ marginTop: "12px", overflowX: "auto", paddingBottom: "14px" }}>
              {countryOptions.map((c) => {
                const isActive = activeCountry === c;
                const label = c === "all" ? "All countries" : c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActiveCountry(c)}
                    style={{
                      background: isActive ? "rgba(193,125,62,0.15)" : "rgba(245,239,230,0.04)",
                      border: isActive ? "1px solid rgba(193,125,62,0.4)" : "1px solid rgba(245,239,230,0.08)",
                      padding: "6px 14px",
                      fontFamily: "Abel, sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      color: isActive ? "#C17D3E" : "rgba(200,184,154,0.4)",
                      cursor: "pointer",
                      transition: "all 200ms",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      borderRadius: 0,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Result count + clear */}
            <div className="flex justify-between items-center" style={{ paddingBottom: "12px" }}>
              <span style={{ fontFamily: "Abel, sans-serif", fontSize: "11px", color: "rgba(200,184,154,0.2)" }}>
                {filtered.length} wines
              </span>
              {activeFilters > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "Abel, sans-serif",
                    fontSize: "11px",
                    color: "rgba(193,125,62,0.6)",
                    cursor: "pointer",
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Wine list */}
        <section className="px-6 pt-4 pb-[120px] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300, fontSize: "22px", color: "rgba(200,184,154,0.35)" }}>
                  No wines match your selection
                </p>
                <p style={{ fontFamily: "Abel, sans-serif", fontSize: "13px", color: "rgba(200,184,154,0.2)", marginTop: "8px" }}>
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              grouped.map((group) => {
                const showCatHeader = group.category !== lastRenderedCategory;
                lastRenderedCategory = group.category;

                return (
                  <div key={group.key}>
                    {showCatHeader && (
                      <h2
                        id={`section-${group.category}`}
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
                        {CATEGORY_LABELS[group.category]}
                      </h2>
                    )}

                    <p style={{ fontFamily: "Abel, sans-serif", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,184,154,0.25)", padding: "28px 0 10px" }}>
                      {group.label}
                    </p>

                    {group.wines.map((wine) => (
                      <WineRow key={wine.id} wine={wine} query={normalizedQuery} />
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 text-center sm:px-8 lg:px-12" style={{ borderTop: "1px solid rgba(245,239,230,0.06)" }}>
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
                style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: "rgba(200,184,154,0.5)", textDecoration: "none" }}
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
