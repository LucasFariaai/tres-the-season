import { useSeason, seasonLabels } from "@/lib/seasonContext";
import { Link } from "react-router-dom";

export default function ReserveSection() {
  const { season } = useSeason();

  return (
    <section id="reserve" className="bg-background season-transition py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-season-mid mb-4 season-transition">
              The Rhythm
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-season-dark mb-8 season-transition">
              Visit Tres
            </h2>

            <div className="space-y-6 font-body text-foreground">
              <div>
                <h3 className="font-display text-lg text-season-dark mb-2 season-transition">Hours</h3>
                <p className="text-sm text-muted-foreground">Wednesday – Saturday</p>
                <p className="text-sm text-muted-foreground">18:00 – 23:00</p>
              </div>

              <div>
                <h3 className="font-display text-lg text-season-dark mb-2 season-transition">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Walhalla, Veerhaven 1<br />
                  3011 BK Rotterdam<br />
                  The Netherlands
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg text-season-dark mb-2 season-transition">Getting here</h3>
                <p className="text-sm text-muted-foreground">
                  Take the watertaxi from Rotterdam harbour.<br />
                  A seven-minute crossing across the Maas.
                </p>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="flex flex-col justify-center">
            <div className="bg-season-lighter/50 rounded-sm p-8 text-center season-transition">
              <p className="font-accent text-lg text-season-dark mb-2 season-transition">
                {seasonLabels[season]} Tasting Menu
              </p>
              <p className="font-display text-4xl text-season-darkest mb-6 season-transition">€185</p>
              <p className="font-body text-sm text-season-mid mb-8 season-transition">
                per person · wine pairing available
              </p>
              <Link
                to="/reserve"
                className="inline-block w-full px-8 py-4 bg-season-dark text-season-lightest font-body text-sm tracking-widest uppercase rounded-sm hover:bg-season-darkest transition-colors season-transition text-center"
              >
                Reserve a Table
              </Link>
              <p className="text-xs text-season-mid mt-4 season-transition">
                Reservations recommended 2–3 weeks ahead
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
