import { useSeason } from "@/lib/seasonContext";

export default function SeasonBar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 text-season-nav-fg"
      style={{
        backgroundColor: "rgba(26, 20, 16, 0.3)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-xl tracking-widest uppercase"
        >
          Tres
        </button>

        {/* Right: Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-body tracking-wide">
          {[
            { label: "Menu", id: "menu" },
            { label: "Producers", id: "producers" },
            { label: "Process", id: "process" },
            { label: "Reserve", id: "reserve" },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="opacity-80 hover:opacity-100 transition-opacity relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-season-light after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
