import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, MessageCircle, CreditCard, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertarPedido, upsertCliente } from "@/lib/supabase";

const WHATSAPP_NUMBER = "5492942462405";
const formatPrice = (n: number) => "$" + n.toLocaleString("es-AR");

type CheckoutStep = "cart" | "details";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState({
    nombre: "",
    contacto: "",
    direccion: "",
    tipo: "Minorista" as "Minorista" | "Mayorista",
    metodo_pago: "Efectivo" as "Efectivo" | "Transferencia" | "Cuenta corriente",
  });

  if (!isOpen) return null;

  const buildWhatsAppMessage = (idWeb: string) => {
    const itemsDetail = items.map((i) => {
      const label = i.type === "unit" ? "unidad" : `caja x${i.product.boxSize}`;
      return `${i.product.name} (${label}) x${i.quantity}`;
    }).join(", ");

    return `✅ *NUEVO PEDIDO - Lechuga Fresca*

👤 *Cliente:* ${form.nombre}
📞 *Contacto:* ${form.contacto}
📍 *Dirección:* ${form.direccion}
🏷️ *Tipo:* ${form.tipo}

📦 *Cantidad:* ${itemsDetail}
💰 *Total:* ${formatPrice(totalPrice)}
💳 *Pago:* ${form.metodo_pago}
🚚 *Logística:* Pendiente de asignar

🆔 *ID Pedido:* ${idWeb}`;
  };

  const handleWhatsApp = async () => {
    if (!form.nombre.trim() || !form.contacto.trim() || !form.direccion.trim()) return;

    const idWeb = `WEB-${Date.now().toString(36).toUpperCase()}`;
    const itemsData = items.map((i) => {
      const price = i.type === "unit" ? i.product.priceUnit : i.product.priceBox;
      return {
        producto_id: i.product.id,
        nombre: i.product.name,
        cantidad: i.quantity,
        tipo_venta: (i.type === "unit" ? "unidad" : "caja") as "unidad" | "caja",
        precio_unitario: price,
        subtotal: price * i.quantity,
      };
    });

    // Guardar pedido + cliente en Supabase (fire-and-forget)
    Promise.all([
      insertarPedido({
        cliente_nombre: form.nombre,
        cliente_contacto: form.contacto,
        cliente_direccion: form.direccion,
        cliente_tipo: form.tipo,
        metodo_pago: form.metodo_pago,
        items: itemsData,
        total: totalPrice,
        estado: "pendiente",
        id_web: idWeb,
      }),
      upsertCliente({
        nombre: form.nombre,
        contacto: form.contacto,
        direccion: form.direccion,
        tipo: form.tipo,
        origen: "web",
      }),
    ]).catch(() => {
      // Si Supabase falla, el pedido igual se confirma por WhatsApp
    });

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(idWeb))}`;
    window.open(url, "_blank");
    clearCart();
    setStep("cart");
    setForm({ nombre: "", contacto: "", direccion: "", tipo: "Minorista", metodo_pago: "Efectivo" });
  };

  const handleMercadoPago = async () => {
    alert("MercadoPago estará disponible próximamente");
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep("cart");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          {step === "details" ? (
            <button onClick={() => setStep("cart")} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver al carrito
            </button>
          ) : (
            <h3 className="text-lg font-bold text-card-foreground font-display">Tu carrito ({totalItems})</h3>
          )}
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "cart" ? (
          <>
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
                          <button onClick={() => updateQuantity(item.product.id, item.type, item.quantity - 1)} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-card-foreground transition-colors">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-card-foreground">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.type, item.quantity + 1)} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-card-foreground transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.product.id, item.type)} className="text-destructive hover:text-destructive/80 transition-colors">
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
                  onClick={() => setStep("details")}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" /> Confirmar pedido
                </button>
                <button
                  onClick={handleMercadoPago}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground hover:bg-accent/80 transition-colors"
                >
                  <CreditCard className="w-5 h-5" /> Pagar con MercadoPago
                </button>
                <button onClick={clearCart} className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors">
                  Vaciar carrito
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Details form */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <h3 className="text-lg font-bold text-card-foreground">Datos para tu pedido</h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cart-nombre">Nombre</Label>
                  <Input id="cart-nombre" placeholder="Juan Pérez" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cart-contacto">Teléfono / Contacto</Label>
                  <Input id="cart-contacto" placeholder="299-4000000" value={form.contacto} onChange={e => setForm(f => ({ ...f, contacto: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cart-direccion">Dirección de entrega</Label>
                  <Input id="cart-direccion" placeholder="Av. Argentina 123" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo de cliente</Label>
                  <Select value={form.tipo} onValueChange={(v: "Minorista" | "Mayorista") => setForm(f => ({ ...f, tipo: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Minorista">Minorista</SelectItem>
                      <SelectItem value="Mayorista">Mayorista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Método de pago</Label>
                  <Select value={form.metodo_pago} onValueChange={(v: "Efectivo" | "Transferencia" | "Cuenta corriente") => setForm(f => ({ ...f, metodo_pago: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Transferencia">Transferencia</SelectItem>
                      <SelectItem value="Cuenta corriente">Cuenta corriente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Order summary */}
              <div className="rounded-lg border border-border p-3 space-y-2">
                <p className="text-sm font-semibold text-card-foreground">Resumen del pedido</p>
                {items.map((i) => {
                  const label = i.type === "unit" ? "unidad" : `caja x${i.product.boxSize}`;
                  const price = i.type === "unit" ? i.product.priceUnit : i.product.priceBox;
                  return (
                    <div key={`${i.product.id}-${i.type}`} className="flex justify-between text-sm text-muted-foreground">
                      <span>{i.product.name} ({label}) x{i.quantity}</span>
                      <span className="font-medium text-card-foreground">{formatPrice(price * i.quantity)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between text-base font-bold text-card-foreground border-t border-border pt-2">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Send button */}
            <div className="border-t border-border p-5">
              <button
                onClick={handleWhatsApp}
                disabled={!form.nombre.trim() || !form.contacto.trim() || !form.direccion.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" /> Confirmar por WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
