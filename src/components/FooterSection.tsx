import { useSeason, seasonQuotes } from "@/lib/seasonContext";

export default function FooterSection() {
  const { season } = useSeason();

  return (
    <footer className="bg-season-darkest season-transition py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="font-accent text-xl sm:text-2xl text-season-light mb-12 season-transition">
          "{seasonQuotes[season]}"
        </p>

        <p className="font-display text-2xl tracking-widest text-season-lighter mb-6 season-transition uppercase">
          Tres
        </p>
        <p className="font-body text-sm text-season-mid season-transition">
          Rotterdam · The Netherlands
        </p>
        <div className="flex justify-center gap-6 mt-6">
          {["Instagram", "Email"].map((label) => (
            <a
              key={label}
              href="#"
              className="font-body text-xs tracking-widest uppercase text-season-mid hover:text-season-light transition-colors season-transition"
            >
              {label}
            </a>
          ))}
        </div>

        <p className="mt-12 text-xs text-season-mid/50 font-body season-transition">
          © {new Date().getFullYear()} Tres Rotterdam. A living website that breathes with nature.
        </p>
      </div>
    </footer>
  );
}
