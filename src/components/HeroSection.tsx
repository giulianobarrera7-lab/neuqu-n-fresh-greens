import heroImg from "@/assets/hero-greenhouse.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Invernadero hidropónico con lechugas frescas en Neuquén"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-2xl space-y-6">
          <div className="flex flex-wrap gap-3">
            {["100% sin pesticidas", "Producción local", "Cosecha del día"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full bg-accent/90 px-4 py-1.5 text-sm font-semibold text-accent-foreground backdrop-blur-sm"
              >
                {badge}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight text-balance">
            Lechugas frescas, cultivadas sin tierra, en el corazón de Neuquén
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg">
            Producción hidropónica sustentable — venta directa a hogares, restaurantes y supermercados
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#productos"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-lg"
            >
              Ver productos
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary-foreground/30 bg-primary-foreground/10 px-8 py-3.5 text-base font-semibold text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20"
            >
              Hacé tu pedido
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
