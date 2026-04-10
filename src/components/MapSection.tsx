import { MapPin, Navigation } from "lucide-react";

const ADDRESS = "Víctor A. García 1075, Neuquén, Argentina";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;

const MapSection = () => {
  return (
    <section className="py-20 bg-secondary/40">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">¿Dónde estamos?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Producimos en Neuquén y entregamos en toda la región patagónica.
          </p>
        </div>
        <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-card-foreground">HidroVerde</p>
            <p className="text-muted-foreground">Víctor A. García 1075</p>
            <p className="text-muted-foreground">Neuquén, Patagonia Argentina</p>
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Navigation className="w-5 h-5" />
            Cómo llegar
          </a>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
