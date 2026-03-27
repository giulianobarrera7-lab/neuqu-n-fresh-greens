import { useState } from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5492994000000"; // Reemplazar con número real

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", clientType: "particular", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to backend
    setSubmitted(true);
  };

  const clientTypes = [
    { value: "particular", label: "Particular" },
    { value: "restaurante", label: "Restaurante" },
    { value: "verduleria", label: "Verdulería" },
    { value: "supermercado", label: "Supermercado" },
  ];

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Hacé tu pedido</h2>
          <p className="text-muted-foreground text-lg">Respondemos en menos de 2 horas</p>
        </div>

        {submitted ? (
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-8 text-center space-y-3">
            <h3 className="text-xl font-bold text-foreground font-display">¡Gracias por tu mensaje!</h3>
            <p className="text-muted-foreground">Nos comunicamos pronto con vos.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-card-foreground">Nombre</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-card-foreground">Teléfono</label>
                <input
                  type="tel"
                  required
                  maxLength={20}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="299 400 0000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-card-foreground">Email</label>
              <input
                type="email"
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-card-foreground">Tipo de cliente</label>
              <div className="flex flex-wrap gap-2">
                {clientTypes.map((ct) => (
                  <button
                    key={ct.value}
                    type="button"
                    onClick={() => setForm({ ...form, clientType: ct.value })}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      form.clientType === ct.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-card-foreground">Mensaje o pedido</label>
              <textarea
                required
                maxLength={1000}
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Contanos qué necesitás..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Enviar pedido
            </button>
          </form>
        )}

        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm mb-3">O escribinos directo por WhatsApp</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola! Quiero consultar por lechugas hidropónicas")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-leaf-dark px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-leaf-dark/90"
          >
            <MessageCircle className="w-5 h-5" />
            Abrir WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
