import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, MessageCircle, CreditCard } from "lucide-react";

const WHATSAPP_NUMBER = "5492994000000";

const formatPrice = (n: number) => "$" + n.toLocaleString("es-AR");

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  const buildWhatsAppMessage = () => {
    let msg = "🥬 *Nuevo pedido HidroVerde*\n\n";
    items.forEach((i) => {
      const label = i.type === "unit" ? "unidad" : `caja x${i.product.boxSize}`;
      const price = i.type === "unit" ? i.product.priceUnit : i.product.priceBox;
      msg += `• ${i.product.name} (${label}) x${i.quantity} — ${formatPrice(price * i.quantity)}\n`;
    });
    msg += `\n*Total: ${formatPrice(totalPrice)}*`;
    return msg;
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    window.open(url, "_blank");
  };

  const handleMercadoPago = async () => {
    // Will be connected to edge function
    alert("MercadoPago estará disponible próximamente");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-lg font-bold text-card-foreground font-display">Tu carrito ({totalItems})</h3>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Tu carrito está vacío</p>
          ) : (
            items.map((item) => {
              const price = item.type === "unit" ? item.product.priceUnit : item.product.priceBox;
              const label = item.type === "unit" ? "Unidad" : `Caja x${item.product.boxSize}`;
              return (
                <div key={`${item.product.id}-${item.type}`} className="flex gap-3 bg-secondary/50 rounded-lg p-3">
                  <img src={item.product.img} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-card-foreground truncate">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-bold text-primary mt-1">{formatPrice(price * item.quantity)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.type, item.quantity - 1)}
                        className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-card-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.type, item.quantity + 1)}
                        className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.type)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-card-foreground">{formatPrice(totalPrice)}</span>
            </div>
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-leaf-dark px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-leaf-dark/90 transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> Pedir por WhatsApp
            </button>
            <button
              onClick={handleMercadoPago}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[hsl(210,80%,50%)] px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-[hsl(210,80%,45%)] transition-colors"
            >
              <CreditCard className="w-5 h-5" /> Pagar con MercadoPago
            </button>
            <button
              onClick={clearCart}
              className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
