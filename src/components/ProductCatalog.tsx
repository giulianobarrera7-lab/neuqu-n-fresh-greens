import { useEffect, useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCart, type CartProduct } from "@/context/CartContext";
import { fetchProductosActivos, type Producto } from "@/lib/supabase";

const API_URL = "https://neuqu-n-fresh-greens.onrender.com";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=640&h=640&fit=crop";

const formatPrice = (n: number) => "$" + n.toLocaleString("es-AR");

const toCartProduct = (p: Producto): CartProduct => ({
  id: p.id ?? p.nombre,
  name: p.nombre,
  img: p.imagen_url || FALLBACK_IMG,
  priceUnit: p.precio_unidad,
  priceBox: p.precio_caja,
  boxSize: p.unidades_por_caja,
});

const ProductCatalog = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductosActivos()
      .then((data) => setProducts(data))
      .catch(async () => {
        // Fallback al API de Render si Supabase falla
        try {
          const r = await fetch(`${API_URL}/productos?solo_activos=true`);
          const json = await r.json();
          setProducts(json.productos ?? []);
        } catch {
          setError("No se pudieron cargar los productos");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="productos" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Nuestros Productos</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Cosechados con amor, entregados con frescura. Lechugas hidropónicas de la más alta calidad.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && <p className="text-center text-destructive">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-muted-foreground">No hay productos disponibles en este momento.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => {
            const img = p.imagen_url || FALLBACK_IMG;
            return (
              <div key={p.id ?? p.nombre} className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img src={img} alt={p.nombre} loading="lazy" width={640} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold bg-accent/20 text-leaf-dark">
                    Disponible
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-card-foreground font-display">{p.nombre}</h3>
                  <p className="text-muted-foreground text-sm">{p.descripcion}</p>
                  <div className="flex items-end justify-between pt-2 border-t border-border">
                    <div>
                      <span className="text-xs text-muted-foreground">Unidad</span>
                      <p className="text-lg font-bold text-primary">{formatPrice(p.precio_unidad)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Caja x{p.unidades_por_caja}</span>
                      <p className="text-lg font-bold text-leaf-dark">{formatPrice(p.precio_caja)}</p>
                    </div>
                  </div>
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
