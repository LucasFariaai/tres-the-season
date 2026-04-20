import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import logoTres from "@/assets/logo-tres-nav.svg";

export default function SeasonBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToSection = (id: string) => {
    setIsOpen(false);
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
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop floating island */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 hidden lg:block">
        <nav
          className={`rounded-full border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-6 py-3 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "bg-black/50 backdrop-blur-xl" : "bg-black/40 backdrop-blur-lg"
          }`}
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

          {/* Center links */}
          <div className="flex items-center gap-1">
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
          </div>

          {/* CTA */}
          <button
            onClick={() => goToSection("reserve")}
            className="bg-white text-black rounded-full px-4 py-1.5 text-sm font-medium hover:bg-white/90 transition-all duration-300 flex items-center gap-1.5 shrink-0"
          >
            Reserve
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      </div>

      {/* Mobile floating island */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[calc(100%-2rem)] px-0 lg:hidden">
        <div
          className={`rounded-full border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-5 py-3 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "bg-black/50 backdrop-blur-xl" : "bg-black/40 backdrop-blur-lg"
          }`}
        >
          <button onClick={goHome} aria-label="Tres Rotterdam">
            <img
              src={logoTres}
              alt="Tres"
              className="h-5 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile fullscreen menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xl transition-all duration-400 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-6">
          <button
            onClick={() => goToSection("menu")}
            className="text-2xl text-white/60 hover:text-white transition-colors duration-300"
          >
            Menu
          </button>
          <button
            onClick={() => goToSection("concept")}
            className="text-2xl text-white/60 hover:text-white transition-colors duration-300"
          >
            Concept
          </button>
          <button
            onClick={() => goToSection("producers")}
            className="text-2xl text-white/60 hover:text-white transition-colors duration-300"
          >
            Producers
          </button>
          <button
            onClick={() => goToSection("reserve")}
            className="bg-white text-black rounded-full px-6 py-2.5 text-lg font-medium hover:bg-white/90 transition-all duration-300 flex items-center gap-2 mt-4"
          >
            Reserve
            <ArrowRight className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </>
  );
}
