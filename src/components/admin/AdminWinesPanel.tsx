import { useMemo, useState } from "react";
import { AdminFieldInput } from "@/components/admin/AdminFieldInput";
import { buttonBase, fieldLabelStyle, fieldStyle, sectionHeaderStyle, uiPalette } from "@/components/admin/adminStyles";
import type { VisualEditor } from "@/components/admin/types";
import type { WineCategory, WineItem } from "@/lib/site-editor/types";

const CATEGORY_OPTIONS: { value: WineCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sparkling", label: "Sparkling" },
  { value: "white", label: "White" },
  { value: "red", label: "Red" },
  { value: "dessert", label: "Dessert" },
];

function newWineId(items: WineItem[]): string {
  const existingNumbers = items
    .map((item) => /(\d+)/.exec(item.id)?.[1])
    .filter(Boolean)
    .map((value) => parseInt(value as string, 10));
  const next = (existingNumbers.length ? Math.max(...existingNumbers) : 0) + 1;
  return `w${String(next).padStart(2, "0")}`;
}

function normalize(value: string | number | null | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

type Props = {
  editor: VisualEditor;
};

export function AdminWinesPanel({ editor }: Props) {
  const wines = editor.content.wines.items;
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<WineCategory | "all">("all");
  const [activeCountry, setActiveCountry] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const countryOptions = useMemo(() => {
    const set = new Set(wines.map((w) => w.country).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [wines]);

  const regionOptions = useMemo(() => {
    const set = new Set(wines.map((w) => w.region).filter(Boolean));
    return Array.from(set).sort();
  }, [wines]);

  const subregionOptions = useMemo(() => {
    const set = new Set(wines.map((w) => w.subregion).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [wines]);

  const grapeOptions = useMemo(() => {
    const set = new Set<string>();
    wines.forEach((wine) => {
      wine.grapes
        .split(",")
        .map((grape) => grape.trim())
        .filter(Boolean)
        .forEach((grape) => set.add(grape));
    });
    return Array.from(set).sort();
  }, [wines]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return wines.filter((wine) => {
      if (activeCategory !== "all" && wine.category !== activeCategory) return false;
      if (activeCountry !== "all" && wine.country !== activeCountry) return false;
      if (!q) return true;
      return [wine.name, wine.producer, wine.grapes, wine.region, wine.subregion ?? "", wine.country, wine.vintage ?? ""]
        .some((field) => normalize(field).includes(q));
    });
  }, [wines, query, activeCategory, activeCountry]);

  const updateWine = (id: string, key: keyof WineItem, value: WineItem[keyof WineItem]) => {
    editor.setContent((current) => ({
      ...current,
      wines: {
        ...current.wines,
        items: current.wines.items.map((wine) =>
          wine.id === id ? { ...wine, [key]: value } : wine,
        ),
      },
    }));
  };

  const removeWine = (id: string) => {
    editor.setContent((current) => ({
      ...current,
      wines: {
        ...current.wines,
        items: current.wines.items.filter((wine) => wine.id !== id),
      },
    }));
    if (expandedId === id) setExpandedId(null);
  };

  const addWine = () => {
    const id = newWineId(wines);
    const draftCategory: WineCategory = activeCategory === "all" ? "white" : activeCategory;
    editor.setContent((current) => ({
      ...current,
      wines: {
        ...current.wines,
        items: [
          {
            id,
            category: draftCategory,
            country: activeCountry === "all" ? "" : activeCountry,
            region: "",
            subregion: "",
            vintage: "",
            name: "New wine",
            producer: "",
            grapes: "",
            price: 0,
            featured: false,
          },
          ...current.wines.items,
        ],
      },
    }));
    setExpandedId(id);
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <datalist id="wine-country-options">
        {countryOptions.filter((country) => country !== "all").map((country) => (
          <option key={country} value={country} />
        ))}
      </datalist>
      <datalist id="wine-region-options">
        {regionOptions.map((region) => <option key={region} value={region} />)}
      </datalist>
      <datalist id="wine-subregion-options">
        {subregionOptions.map((subregion) => <option key={subregion} value={subregion} />)}
      </datalist>
      <datalist id="wine-grape-options">
        {grapeOptions.map((grape) => <option key={grape} value={grape} />)}
      </datalist>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={sectionHeaderStyle}>{wines.length} wines</h2>
        <button type="button" onClick={addWine} style={{ ...buttonBase, padding: "6px 12px", color: uiPalette.controlText }}>
          + Add wine
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name, producer, grape, region…"
        style={fieldStyle}
      />

      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ ...fieldLabelStyle, marginRight: 6 }}>Category</span>
          {CATEGORY_OPTIONS.map((option) => {
            const isActive = activeCategory === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveCategory(option.value)}
                style={{
                  ...buttonBase,
                  padding: "5px 10px",
                  fontSize: 11,
                  background: isActive ? uiPalette.accent : "transparent",
                  borderColor: isActive ? uiPalette.accent : uiPalette.ghostBorder,
                  color: isActive ? uiPalette.accentText : uiPalette.controlText,
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={fieldLabelStyle}>Country</span>
          <input
            type="text"
            list="wine-country-options"
            value={activeCountry === "all" ? "" : activeCountry}
            onChange={(event) => setActiveCountry(event.target.value.trim() || "all")}
            placeholder="All countries"
            style={{ ...fieldStyle, padding: "6px 10px", fontSize: 12, width: 200 }}
          />
          {activeCountry !== "all" ? (
            <button
              type="button"
              onClick={() => setActiveCountry("all")}
              aria-label="Clear country filter"
              style={{ ...buttonBase, padding: "4px 8px", fontSize: 11, color: uiPalette.controlText }}
            >
              ✕
            </button>
          ) : null}
        </div>

        <div style={{ marginLeft: "auto", fontFamily: '"Abel", sans-serif', fontSize: 11, color: uiPalette.controlMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Showing {filtered.length} of {wines.length}
        </div>
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        {filtered.map((wine) => {
          const isExpanded = expandedId === wine.id;
          return (
            <div
              key={wine.id}
              style={{
                border: `1px solid ${uiPalette.controlBorder}`,
                background: isExpanded ? "rgba(255,255,255,0.02)" : "transparent",
              }}
            >
              <button
                type="button"
                onClick={() => setExpandedId((current) => (current === wine.id ? null : wine.id))}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  color: uiPalette.controlText,
                }}
              >
                <div style={{ display: "grid", gap: 2, minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                    <span style={{ fontFamily: '"Abel", sans-serif', fontSize: 11, color: uiPalette.controlMuted, minWidth: 36 }}>
                      {wine.vintage ?? "NV"}
                    </span>
                    <span style={{ fontFamily: '"Abel", sans-serif', fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {wine.name || "Untitled"}
                    </span>
                  </div>
                  <span style={{ fontFamily: '"Abel", sans-serif', fontSize: 11, color: uiPalette.controlMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {wine.producer} · {wine.region}
                  </span>
                </div>
                <span style={{ fontFamily: '"Abel", sans-serif', fontSize: 13, color: "#C8B89A", flexShrink: 0 }}>
                  €{wine.price}
                </span>
              </button>

              {isExpanded ? (
                <div style={{ display: "grid", gap: 8, padding: "0 10px 10px" }}>
                  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(3, 1fr)" }}>
                    <AdminFieldInput label="Name" value={wine.name} onChange={(value) => updateWine(wine.id, "name", value)} />
                    <AdminFieldInput label="Producer" value={wine.producer} onChange={(value) => updateWine(wine.id, "producer", value)} />
                    <AdminFieldInput label="Grapes (comma-separated)" value={wine.grapes} list="wine-grape-options" placeholder="Type or pick a grape — new ones are added on save" onChange={(value) => updateWine(wine.id, "grapes", value)} />
                  </div>
                  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(3, 1fr)" }}>
                    <AdminFieldInput label="Country" value={wine.country} list="wine-country-options" placeholder="Pick a country or type a new one" onChange={(value) => updateWine(wine.id, "country", value)} />
                    <AdminFieldInput label="Region" value={wine.region} list="wine-region-options" placeholder="Pick a region or type a new one" onChange={(value) => updateWine(wine.id, "region", value)} />
                    <AdminFieldInput label="Subregion" value={wine.subregion ?? ""} list="wine-subregion-options" placeholder="Optional" onChange={(value) => updateWine(wine.id, "subregion", value)} />
                  </div>
                  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "120px 120px 1fr auto" }}>
                    <AdminFieldInput label="Vintage" value={wine.vintage ?? ""} onChange={(value) => updateWine(wine.id, "vintage", value)} />
                    <AdminFieldInput
                      label="Price (€)"
                      value={String(wine.price)}
                      onChange={(value) => {
                        const parsed = parseFloat(value);
                        if (!Number.isNaN(parsed)) updateWine(wine.id, "price", parsed);
                      }}
                    />
                    <div style={{ display: "grid", gap: 4 }}>
                      <span style={fieldLabelStyle}>Category</span>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {(["sparkling", "white", "red", "dessert"] as WineCategory[]).map((category) => {
                          const isActive = wine.category === category;
                          return (
                            <button
                              key={category}
                              type="button"
                              onClick={() => updateWine(wine.id, "category", category)}
                              style={{
                                ...buttonBase,
                                padding: "5px 9px",
                                fontSize: 10,
                                background: isActive ? uiPalette.accent : "transparent",
                                borderColor: isActive ? uiPalette.accent : uiPalette.ghostBorder,
                                color: isActive ? uiPalette.accentText : uiPalette.controlText,
                              }}
                            >
                              {category}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", justifyContent: "flex-end" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, color: uiPalette.controlText, fontFamily: '"Abel", sans-serif', fontSize: 11, whiteSpace: "nowrap" }}>
                        <input
                          type="checkbox"
                          checked={wine.featured ?? false}
                          onChange={(event) => updateWine(wine.id, "featured", event.target.checked)}
                        />
                        Highlight
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Remove "${wine.name || `wine ${wine.id}`}"?`)) removeWine(wine.id);
                        }}
                        style={{ ...buttonBase, padding: "5px 10px", color: "#c0533b", borderColor: "rgba(192,83,59,0.4)", fontSize: 10 }}
                      >
                      Remove
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        {filtered.length === 0 ? (
          <div style={{ padding: "24px 12px", textAlign: "center", color: uiPalette.controlMuted, fontFamily: '"Abel", sans-serif', fontSize: 13 }}>
            No wines match the current filter.
          </div>
        ) : null}
      </div>
    </div>
  );
}
