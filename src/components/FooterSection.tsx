import { Instagram, Facebook } from "lucide-react";
import logoTres from "@/assets/logo-tres.png";

export default function FooterSection() {
  return (
    <footer className="bg-season-darkest season-transition py-24">
      <div className="max-w-md mx-auto px-6 text-center">
        <p className="font-accent italic text-lg sm:text-xl text-season-light/50 mb-10 season-transition">
          "Complex without being complicated."
        </p>

        <div className="flex justify-center gap-5 mb-10">
          <a
            href="#"
            aria-label="Instagram"
            className="text-season-mid/60 hover:text-season-light transition-colors season-transition"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="text-season-mid/60 hover:text-season-light transition-colors season-transition"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </div>

        <img src={logoTres} alt="Tres" className="h-6 w-auto mx-auto opacity-40" />
      </div>
    </footer>
  );
}
