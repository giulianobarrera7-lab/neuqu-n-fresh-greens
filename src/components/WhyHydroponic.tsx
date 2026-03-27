import { Droplets, Leaf, Sun, Clock } from "lucide-react";

const benefits = [
  { icon: Leaf, title: "Sin tierra, sin pesticidas", desc: "Cultivo limpio que cuida tu salud y el medio ambiente." },
  { icon: Droplets, title: "90% menos uso de agua", desc: "Versus el cultivo tradicional. Producción sustentable." },
  { icon: Sun, title: "Cosecha todo el año", desc: "Sin depender del clima. Frescura garantizada siempre." },
  { icon: Clock, title: "Del invernadero a tu mesa", desc: "En menos de 24 horas. Máxima frescura y sabor." },
];

const WhyHydroponic = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground text-center mb-14">
          ¿Por qué hidropónico?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                <b.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-primary-foreground font-display">{b.title}</h3>
              <p className="text-primary-foreground/75 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyHydroponic;
