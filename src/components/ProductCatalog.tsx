import mantecosa from "@/assets/lechuga-mantecosa.jpg";
import crespaVerde from "@/assets/lechuga-crespa-verde.jpg";
import crespaMorada from "@/assets/lechuga-crespa-morada.jpg";
import roble from "@/assets/lechuga-roble.jpg";
import mixHojas from "@/assets/mix-hojas.jpg";
import rucula from "@/assets/rucula.jpg";
import { ShoppingCart } from "lucide-react";
import { useCart, type CartProduct } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  desc: string;
  img: string;
  priceUnit: number;
  priceBox: number;
  priceUnitLabel: string;
  priceBoxLabel: string;
  boxSize: number;
  status: "available" | "soon" | "soldout";
};

const products: Product[] = [
  { id: "mantecosa", name: "Lechuga Mantecosa", desc: "Tierna y suave, ideal para ensaladas", img: mantecosa, priceUnit: 800, priceBox: 7200, priceUnitLabel: "$800", priceBoxLabel: "$7.200", boxSize: 12, status: "available" },
  { id: "crespa-verde", name: "Lechuga Crespa Verde", desc: "Crujiente y fresca, la clásica", img: crespaVerde, priceUnit: 750, priceBox: 6800, priceUnitLabel: "$750", priceBoxLabel: "$6.800", boxSize: 12, status: "available" },
  { id: "crespa-morada", name: "Lechuga Crespa Morada", desc: "Color intenso, rica en antioxidantes", img: crespaMorada, priceUnit: 900, priceBox: 8400, priceUnitLabel: "$900", priceBoxLabel: "$8.400", boxSize: 12, status: "available" },
  { id: "roble", name: "Lechuga Roble", desc: "Hojas onduladas, sabor delicado", img: roble, priceUnit: 850, priceBox: 7800, priceUnitLabel: "$850", priceBoxLabel: "$7.800", boxSize: 12, status: "soon" },
  { id: "mix-hojas", name: "Mix de Hojas", desc: "Combinación de variedades premium", img: mixHojas, priceUnit: 1100, priceBox: 10500, priceUnitLabel: "$1.100", priceBoxLabel: "$10.500", boxSize: 12, status: "available" },
  { id: "rucula", name: "Rúcula Hidropónica", desc: "Sabor intenso, cosecha fresca", img: rucula, priceUnit: 950, priceBox: 8800, priceUnitLabel: "$950", priceBoxLabel: "$8.800", boxSize: 12, status: "available" },
];

const statusLabel: Record<Product["status"], { text: string; className: string }> = {
  available: { text: "Disponible", className: "bg-accent/20 text-leaf-dark" },
  soon: { text: "Cosecha en 3 días", className: "bg-warm/20 text-earth" },
  soldout: { text: "Agotado", className: "bg-muted text-muted-foreground" },
};

const toCartProduct = (p: Product): CartProduct => ({
  id: p.id, name: p.name, img: p.img, priceUnit: p.priceUnit, priceBox: p.priceBox, boxSize: p.boxSize,
});

const ProductCatalog = () => {
  const { addItem } = useCart();

  return (
    <section id="productos" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Nuestros Productos</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Cosechados con amor, entregados con frescura. Lechugas hidropónicas de la más alta calidad.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => {
            const st = statusLabel[p.status];
            const canBuy = p.status === "available";
            return (
              <div key={p.id} className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img src={p.img} alt={p.name} loading="lazy" width={640} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold ${st.className}`}>{st.text}</span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-card-foreground font-display">{p.name}</h3>
                  <p className="text-muted-foreground text-sm">{p.desc}</p>
                  <div className="flex items-end justify-between pt-2 border-t border-border">
                    <div>
                      <span className="text-xs text-muted-foreground">Unidad</span>
                      <p className="text-lg font-bold text-primary">{p.priceUnitLabel}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Caja x{p.boxSize}</span>
                      <p className="text-lg font-bold text-leaf-dark">{p.priceBoxLabel}</p>
                    </div>
                  </div>
                  {canBuy && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => addItem(toCartProduct(p), "unit")}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" /> Unidad
                      </button>
                      <button
                        onClick={() => addItem(toCartProduct(p), "box")}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-leaf-dark px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-leaf-dark/90 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" /> Caja
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
