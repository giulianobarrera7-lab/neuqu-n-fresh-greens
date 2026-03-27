import { Home, Building2, MapPin } from "lucide-react";

const localities = ["Neuquén capital", "Cipolletti", "Plottier", "Centenario", "Cinco Saltos", "Allen", "General Roca"];

const ClientZone = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
          Llegamos a donde estés
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="bg-card rounded-xl p-8 border border-border space-y-4">
            <div className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center">
              <Home className="w-6 h-6 text-leaf-dark" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground font-display">Para tu hogar</h3>
            <p className="text-muted-foreground leading-relaxed">
              Pedí lechugas frescas y te las llevamos a tu casa en Neuquén capital, Cipolletti, Plottier y alrededores. Calidad premium directo del invernadero.
            </p>
            <a href="#contacto" className="inline-flex items-center text-primary font-semibold hover:underline">
              Hacé tu pedido →
            </a>
          </div>

          <div className="bg-card rounded-xl p-8 border border-border space-y-4">
            <div className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-leaf-dark" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground font-display">Para tu negocio</h3>
            <p className="text-muted-foreground leading-relaxed">
              Proveemos a restaurantes, verdulerías y supermercados con volumen constante y calidad garantizada. Pedí tu lista de precios mayorista.
            </p>
            <a href="#contacto" className="inline-flex items-center text-primary font-semibold hover:underline">
              Pedí lista mayorista →
            </a>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-semibold">Zona de delivery</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {localities.map((loc) => (
              <span key={loc} className="bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-card-foreground">
                {loc}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientZone;
