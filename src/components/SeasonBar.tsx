import { forwardRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logoTres from "@/assets/logo-tres-nav.svg";

const RESERVATION_URL = "https://www.exploretock.com/tresrotterdam";

const SeasonBar = forwardRef<HTMLDivElement, Record<string, never>>((_, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const bgClass = scrolled ? "bg-black/50 backdrop-blur-xl" : "bg-black/40 backdrop-blur-lg";

  return (
    <div ref={ref}>
      {/* Desktop floating island — compact, expands on hover */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden lg:block">
        <nav
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`rounded-full border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4 py-2.5 flex items-center gap-3 transition-all duration-500 ease-out ${bgClass}`}
        >
          {/* Logo */}
          <button onClick={goHome} className="shrink-0 flex items-center" aria-label="Tres Rotterdam">
            <img
              src={logoTres}
              alt="Tres"
              className="h-6 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </button>

          {/* Expanding center links */}
          <div
            className="overflow-hidden flex items-center transition-all duration-500 ease-out"
            style={{
              maxWidth: hovered ? "400px" : "0px",
              opacity: hovered ? 1 : 0,
              marginLeft: hovered ? "0.25rem" : "0",
              marginRight: hovered ? "0.25rem" : "0",
            }}
          >
            <div className="flex items-center gap-1 whitespace-nowrap">
              <button
                onClick={() => goToSection("menu")}
                className="text-sm px-3 py-1.5 rounded-full transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
              >
                Menu
              </button>
              <button
                onClick={() => goToSection("concept")}
                className="text-sm px-3 py-1.5 rounded-full transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
              >
                Concept
              </button>
              <button
                onClick={() => goToSection("producers")}
                className="text-sm px-3 py-1.5 rounded-full transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
              >
                Producers
              </button>
              <button
                onClick={() => navigate("/wine-list")}
                className="text-sm px-3 py-1.5 rounded-full transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
              >
                Wine
              </button>
            </div>
          </div>

          {/* CTA */}
          <a
            href={RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black rounded-full px-4 py-1.5 text-sm font-medium hover:bg-white/90 transition-all duration-300 flex items-center gap-1.5 shrink-0"
          >
            Reserve
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </nav>
      </div>

      {/* Mobile floating island — only logo + Reserve */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[calc(100%-2rem)] lg:hidden">
        <div
          className={`rounded-full border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4 py-2.5 flex items-center justify-between transition-all duration-500 ${bgClass}`}
        >
          <button onClick={goHome} aria-label="Tres Rotterdam" className="flex items-center">
            <img
              src={logoTres}
              alt="Tres"
              className="h-5 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </button>

          <a
            href={RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black rounded-full px-4 py-1.5 text-sm font-medium hover:bg-white/90 transition-all duration-300 flex items-center gap-1.5"
          >
            Reserve
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
});

SeasonBar.displayName = "SeasonBar";

export default SeasonBar;
