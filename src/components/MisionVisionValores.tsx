import { useEffect, useRef, useState } from "react";
import { Target, Eye, Sparkles } from "lucide-react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedWords({ text, inView, baseDelay = 0, className = "" }: {
  text: string; inView: boolean; baseDelay?: number; className?: string;
}) {
  return (
    <span className={`inline-flex flex-wrap justify-center gap-x-[0.3em] gap-y-1 ${className}`}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0px)" : "translateY(22px)",
            transition: `opacity 600ms ${baseDelay + i * 90}ms ease-out, transform 600ms ${baseDelay + i * 90}ms ease-out`,
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

const cards = [
  {
    icon: Target,
    label: "Misión",
    text: "Proveer lechugas hidropónicas frescas de la más alta calidad, cultivadas de manera sustentable en Neuquén, llevando salud y sabor natural a cada mesa.",
  },
  {
    icon: Eye,
    label: "Visión",
    text: "Ser el referente de la agricultura hidropónica en la Patagonia, expandiendo un modelo de producción limpio, eficiente y comprometido con el futuro del planeta.",
  },
  {
    icon: Sparkles,
    label: "Valores",
    text: "Sustentabilidad · Frescura · Compromiso · Innovación · Comunidad",
    isValues: true,
  },
];

const MisionVisionValores = () => {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0d1f14 0%, #122b1a 50%, #0a1910 100%)" }}
    >
      {/* Decorative background circles */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(78 60% 48%), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(142 52% 45%), transparent 70%)" }}
      />

      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 space-y-5">
          <span
            className="inline-block text-xs font-semibold tracking-[0.3em] uppercase"
            style={{
              color: "hsl(78 60% 58%)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(-10px)",
              transition: "opacity 600ms 100ms ease-out, transform 600ms 100ms ease-out",
            }}
          >
            Quiénes somos
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            <AnimatedWords text="Nuestra razón de" inView={inView} baseDelay={200} />
            <br />
            <AnimatedWords
              text="cultivar y crecer"
              inView={inView}
              baseDelay={500}
              className="mvv-gradient-text"
            />
          </h2>

          {/* Animated gradient underline */}
          <div
            className="mx-auto h-px rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(78 60% 48%), hsl(142 52% 45%), transparent)",
              width: inView ? "12rem" : "0",
              transition: "width 900ms 700ms ease-out",
              opacity: inView ? 1 : 0,
            }}
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <div
              key={card.label}
              className="group relative rounded-2xl p-8 space-y-5 cursor-default"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0) scale(1)" : "translateY(48px) scale(0.96)",
                transition: `opacity 700ms ${350 + i * 160}ms ease-out, transform 700ms ${350 + i * 160}ms ease-out, box-shadow 300ms ease`,
                boxShadow: "0 0 0 0 rgba(90,200,80,0)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 40px 0 rgba(90,200,80,0.12)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(90,200,80,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 0 rgba(90,200,80,0)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-0.5 rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(78 60% 48%), hsl(142 52% 45%))",
                  width: inView ? "2.5rem" : "0",
                  transition: `width 600ms ${600 + i * 160}ms ease-out`,
                }}
              />

              {/* Icon + label */}
              <div className="flex items-center gap-3">
                <div
                  className="rounded-xl p-2.5"
                  style={{ background: "rgba(90,200,80,0.15)" }}
                >
                  <card.icon className="w-5 h-5" style={{ color: "hsl(78 60% 60%)" }} />
                </div>
                <h3 className="text-xl font-bold text-white">{card.label}</h3>
              </div>

              {/* Text */}
              <p
                className={`text-sm leading-relaxed ${card.isValues ? "font-semibold text-base tracking-wide" : ""}`}
                style={{
                  color: card.isValues ? "hsl(78 60% 65%)" : "rgba(255,255,255,0.65)",
                  opacity: inView ? 1 : 0,
                  transition: `opacity 700ms ${700 + i * 160}ms ease-out`,
                }}
              >
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MisionVisionValores;
