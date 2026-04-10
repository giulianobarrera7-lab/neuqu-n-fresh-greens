const testimonials = [
  {
    name: "Laura M.",
    role: "Cliente hogar",
    text: "Las lechugas llegan increíblemente frescas. Desde que las descubrí no compro más en el super. Se nota la diferencia en el sabor y duran mucho más en la heladera.",
    stars: 5,
  },
  {
    name: "Restaurante La Patagona",
    role: "Cliente gastronómico",
    text: "Trabajamos con HidroVerde hace más de un año. La calidad es constante, la entrega es puntual y el trato es excelente. Nuestros clientes lo notan en los platos.",
    stars: 5,
  },
  {
    name: "Martín R.",
    role: "Cliente hogar",
    text: "Pedí por WhatsApp y en un día tenía las lechugas en casa. Sin pesticidas, de producción local. No hay nada que mejorarle.",
    stars: 5,
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5" aria-label={`${count} estrellas`}>
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-4 h-4 text-accent fill-accent" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.95 2.878c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
      </svg>
    ))}
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-20 bg-secondary/40">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Lo que dicen nuestros clientes</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Calidad que se nota en cada hoja, confianza que se construye con cada entrega.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-xl border border-border p-6 space-y-4 shadow-sm flex flex-col">
              <Stars count={t.stars} />
              <p className="text-card-foreground/80 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
              <div className="pt-2 border-t border-border">
                <p className="font-semibold text-card-foreground text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
