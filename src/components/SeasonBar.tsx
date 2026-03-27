import { useSeason } from "@/lib/seasonContext";
import { useNavigate } from "react-router-dom";

export default function SeasonBar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-4 left-4 right-4 z-50 rounded-full"
      style={{
        backgroundColor: "rgba(247, 243, 237, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(200, 190, 175, 0.25)",
        boxShadow: "0 2px 20px rgba(42, 31, 24, 0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-lg tracking-[0.2em] uppercase"
          style={{ color: "#2A1F18" }}
        >
          Tres
        </button>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-body tracking-wide">
          {[
            { label: "Menu", id: "menu" },
            { label: "Events", id: "producers" },
            { label: "Gift Cards", id: "process" },
            { label: "Loyalty", id: "reserve" },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="transition-opacity hover:opacity-70"
              style={{ color: "#2A1F18", opacity: 0.75 }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right: Reserve button */}
        <button
          onClick={() => navigate("/reserve")}
          className="flex items-center gap-1.5 text-[13px] font-body tracking-wide px-5 py-2 rounded-full transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "#2A1F18",
            color: "#F7F3ED",
          }}
        >
          Reserve
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12L12 4M12 4H6M12 4V10" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
