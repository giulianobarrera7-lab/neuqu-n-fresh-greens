import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#productos", label: "Productos" },
  { href: "#contacto", label: "Contacto" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-foreground/90 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="text-xl font-bold text-background font-display">HidroVerde</a>
        
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-background/80 hover:text-background transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#contacto" className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors">
            Hacé tu pedido
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-background" aria-label="Menú">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-foreground/95 backdrop-blur-md border-t border-background/10 pb-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-6 py-3 text-background/80 hover:text-background text-sm font-medium">
              {l.label}
            </a>
          ))}
          <div className="px-6 pt-2">
            <a href="#contacto" onClick={() => setOpen(false)} className="block text-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
              Hacé tu pedido
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
