import { useNavigate, useLocation } from "react-router-dom";

export default function SeasonBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToMenu = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToReserve = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
    }
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

        {/* Center: Menu only */}
        <button
          onClick={scrollToMenu}
          className="hidden md:block text-[13px] font-body tracking-wide transition-opacity hover:opacity-70"
          style={{ color: "#2A1F18", opacity: 0.75 }}
        >
          Menu
        </button>

        {/* Right: Reserve button */}
        <button
          onClick={scrollToReserve}
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
