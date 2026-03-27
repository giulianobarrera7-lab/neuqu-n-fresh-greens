import { Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-14">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-background/80">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-background font-display">HidroVerde</h3>
            <p className="text-sm leading-relaxed">
              Producción hidropónica local — Neuquén, Patagonia Argentina
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-background">Contacto</h4>
            <div className="space-y-2 text-sm">
              <a href="tel:+5492994000000" className="flex items-center gap-2 hover:text-background transition-colors">
                <Phone className="w-4 h-4" /> +54 299 400 0000
              </a>
              <a href="mailto:info@hidroverde.com.ar" className="flex items-center gap-2 hover:text-background transition-colors">
                <Mail className="w-4 h-4" /> info@hidroverde.com.ar
              </a>
              <a href="https://instagram.com/hidroverde" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-background transition-colors">
                <Instagram className="w-4 h-4" /> @hidroverde
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Neuquén, Patagonia Argentina
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-background">Horarios</h4>
            <div className="text-sm space-y-1">
              <p>Lunes a Viernes: 8:00 – 18:00</p>
              <p>Sábados: 8:00 – 13:00</p>
              <p>Domingos: Cerrado</p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 text-center text-background/50 text-sm">
          © {new Date().getFullYear()} HidroVerde. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
