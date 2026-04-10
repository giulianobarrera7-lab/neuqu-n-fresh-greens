const MapSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">¿Dónde estamos?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Producimos en Neuquén y entregamos en toda la región patagónica.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border shadow-sm aspect-[16/7] w-full">
          <iframe
            title="Ubicación HidroVerde"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-68.18%2C-38.98%2C-67.98%2C-38.90&layer=mapnik&marker=-38.9516%2C-68.0591"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
        <p className="text-center text-muted-foreground text-sm mt-4">
          Neuquén, Patagonia Argentina — entregas a domicilio y puntos de retiro
        </p>
      </div>
    </section>
  );
};

export default MapSection;
