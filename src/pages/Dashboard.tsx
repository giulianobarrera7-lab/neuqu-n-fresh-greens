import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package, TrendingUp, ShoppingCart, BarChart3, RefreshCw, Leaf, ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE = "https://neuqu-n-fresh-greens-2.onrender.com";

interface StockData {
  producto: string;
  stock_kg: number;
  stock_cajones: number;
  precio_minorista_kg: number;
  precio_mayorista_kg: number;
}

interface Pedido {
  id_pedido: string;
  fecha: string;
  cliente: { nombre: string; contacto: string; direccion: string; tipo: string };
  cantidad: number;
  unidad: string;
  kg_total: number;
  precio_unitario: number;
  metodo_pago: string;
  total: number;
  medio_transporte: string;
}

interface ReporteData {
  fecha: string;
  total_pedidos: number;
  minorista: { pedidos: number; kg_vendidos: number; ingresos: number };
  mayorista: { pedidos: number; kg_vendidos: number; ingresos: number };
  total_ingresos: number;
  total_kg_vendidos: number;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [stock, setStock] = useState<StockData | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [reporte, setReporte] = useState<ReporteData | null>(null);
  const [loading, setLoading] = useState({ stock: true, pedidos: true, reporte: true });
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const [form, setForm] = useState({
    nombre: "",
    contacto: "",
    direccion: "",
    tipo: "Minorista" as "Minorista" | "Mayorista",
    cantidad: "",
    unidad: "kg" as "kg" | "cajon" | "cajones",
    metodo_pago: "Efectivo" as "Efectivo" | "Transferencia" | "Cuenta corriente",
  });

  const fetchStock = useCallback(async () => {
    setLoading(l => ({ ...l, stock: true }));
    try {
      const res = await fetch(`${API_BASE}/stock`);
      if (!res.ok) throw new Error("Error al obtener stock");
      setStock(await res.json());
    } catch {
      toast({ title: "Error", description: "No se pudo cargar el stock", variant: "destructive" });
    } finally {
      setLoading(l => ({ ...l, stock: false }));
    }
  }, [toast]);

  const fetchPedidos = useCallback(async () => {
    setLoading(l => ({ ...l, pedidos: true }));
    try {
      const res = await fetch(`${API_BASE}/pedidos?limite=10`);
      if (!res.ok) throw new Error("Error al obtener pedidos");
      const data = await res.json();
      setPedidos(data.pedidos || []);
    } catch {
      toast({ title: "Error", description: "No se pudieron cargar los pedidos", variant: "destructive" });
    } finally {
      setLoading(l => ({ ...l, pedidos: false }));
    }
  }, [toast]);

  const fetchReporte = useCallback(async () => {
    setLoading(l => ({ ...l, reporte: true }));
    try {
      const res = await fetch(`${API_BASE}/reporte`);
      if (!res.ok) throw new Error("Error al obtener reporte");
      setReporte(await res.json());
    } catch {
      toast({ title: "Error", description: "No se pudo cargar el reporte", variant: "destructive" });
    } finally {
      setLoading(l => ({ ...l, reporte: false }));
    }
  }, [toast]);

  useEffect(() => {
    fetchStock();
    fetchPedidos();
    fetchReporte();
  }, [fetchStock, fetchPedidos, fetchReporte]);

  const refreshAll = () => {
    fetchStock();
    fetchPedidos();
    fetchReporte();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cantidad = parseFloat(form.cantidad);
    if (!form.nombre.trim() || !form.contacto.trim() || !form.direccion.trim()) {
      toast({ title: "Campos incompletos", description: "Completá todos los campos del cliente", variant: "destructive" });
      return;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
      toast({ title: "Cantidad inválida", description: "Ingresá una cantidad mayor a 0", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: {
            nombre: form.nombre.trim(),
            contacto: form.contacto.trim(),
            direccion: form.direccion.trim(),
            tipo: form.tipo,
          },
          cantidad,
          unidad: form.unidad,
          metodo_pago: form.metodo_pago,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Error desconocido" }));
        throw new Error(err.detail || "Error al crear pedido");
      }

      const data = await res.json();
      toast({ title: "✅ Pedido creado", description: `${data.pedido.id_pedido} — Total: $${data.pedido.total.toLocaleString()}` });
      setLastOrder(data.pedido);
      setForm(f => ({ ...f, nombre: "", contacto: "", direccion: "", cantidad: "" }));
      refreshAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (n: number) => `$${n.toLocaleString("es-AR")}`;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold font-heading">Panel de Gestión</h1>
              <p className="text-sm opacity-80">Lechuga Fresca — Sistema de Pedidos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="secondary" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Volver al sitio
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={refreshAll} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Actualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Row 1: Stock + Reporte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Stock Actual</CardTitle>
                <CardDescription>Disponibilidad en tiempo real</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {loading.stock ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">Cargando...</div>
              ) : stock ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-primary/10 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{stock.stock_kg.toLocaleString("es-AR")}</p>
                    <p className="text-sm text-muted-foreground">kg disponibles</p>
                  </div>
                  <div className="rounded-lg bg-accent/20 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{stock.stock_cajones.toLocaleString("es-AR")}</p>
                    <p className="text-sm text-muted-foreground">cajones (10 kg c/u)</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-2xl font-bold">{fmt(stock.precio_minorista_kg)}</p>
                    <p className="text-sm text-muted-foreground">Precio minorista / kg</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-2xl font-bold">{fmt(stock.precio_mayorista_kg)}</p>
                    <p className="text-sm text-muted-foreground">Precio mayorista / kg</p>
                  </div>
                </div>
              ) : (
                <p className="text-destructive">No se pudo cargar el stock</p>
              )}
            </CardContent>
          </Card>

          {/* Reporte */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Reporte Diario</CardTitle>
                <CardDescription>{reporte ? `Fecha: ${reporte.fecha}` : "Cargando..."}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {loading.reporte ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">Cargando...</div>
              ) : reporte ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-primary/10 p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{reporte.total_pedidos}</p>
                      <p className="text-xs text-muted-foreground">Pedidos</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{reporte.total_kg_vendidos.toLocaleString("es-AR")}</p>
                      <p className="text-xs text-muted-foreground">kg vendidos</p>
                    </div>
                    <div className="rounded-lg bg-accent/20 p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{fmt(reporte.total_ingresos)}</p>
                      <p className="text-xs text-muted-foreground">Ingresos totales</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3">
                      <p className="text-sm font-medium mb-1">Minorista</p>
                      <p className="text-lg font-bold">{fmt(reporte.minorista.ingresos)}</p>
                      <p className="text-xs text-muted-foreground">{reporte.minorista.pedidos} pedidos — {reporte.minorista.kg_vendidos} kg</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-sm font-medium mb-1">Mayorista</p>
                      <p className="text-lg font-bold">{fmt(reporte.mayorista.ingresos)}</p>
                      <p className="text-xs text-muted-foreground">{reporte.mayorista.pedidos} pedidos — {reporte.mayorista.kg_vendidos} kg</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-destructive">No se pudo cargar el reporte</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Nuevo Pedido */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Nuevo Pedido</CardTitle>
              <CardDescription>Creá un pedido directamente desde el panel</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Juan Pérez" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contacto">Contacto</Label>
                <Input id="contacto" placeholder="299-4000000" value={form.contacto} onChange={e => setForm(f => ({ ...f, contacto: e.target.value }))} maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" placeholder="Av. Argentina 123" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de cliente</Label>
                <Select value={form.tipo} onValueChange={(v: "Minorista" | "Mayorista") => setForm(f => ({ ...f, tipo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minorista">Minorista</SelectItem>
                    <SelectItem value="Mayorista">Mayorista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input id="cantidad" type="number" min="0.1" step="0.1" placeholder="25" value={form.cantidad} onChange={e => setForm(f => ({ ...f, cantidad: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Unidad</Label>
                <Select value={form.unidad} onValueChange={(v: "kg" | "cajon" | "cajones") => setForm(f => ({ ...f, unidad: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogramos</SelectItem>
                    <SelectItem value="cajon">Cajón</SelectItem>
                    <SelectItem value="cajones">Cajones</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
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
              <div className="flex items-end">
                <Button type="submit" className="w-full gap-2" disabled={submitting}>
                  {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                  {submitting ? "Enviando..." : "Crear Pedido"}
                </Button>
              </div>
            </form>

            {lastOrder && (
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
                <MessageCircle className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm text-card-foreground flex-1">
                  Pedido <strong>{lastOrder.id_pedido}</strong> creado — Total: <strong>{fmt(lastOrder.total)}</strong>
                </p>
                <a
                  href={`https://wa.me/542942462405?text=${encodeURIComponent(
                    `✅ *NUEVO PEDIDO - Lechuga Fresca*\n\n👤 *Cliente:* ${lastOrder.cliente.nombre}\n📞 *Contacto:* ${lastOrder.cliente.contacto}\n📍 *Dirección:* ${lastOrder.cliente.direccion}\n🏷️ *Tipo:* ${lastOrder.cliente.tipo}\n\n📦 *Cantidad:* ${lastOrder.cantidad} ${lastOrder.unidad}\n💰 *Total:* $${lastOrder.total.toLocaleString("es-AR")}\n💳 *Pago:* ${lastOrder.metodo_pago}\n🚚 *Logística:* ${lastOrder.medio_transporte}\n\n🆔 *ID Pedido:* ${lastOrder.id_pedido}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
                >
                  <MessageCircle className="h-4 w-4" />
                  Confirmar por WhatsApp
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Row 3: Pedidos Recientes */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>Últimos 10 pedidos registrados</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loading.pedidos ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">Cargando...</div>
            ) : pedidos.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No hay pedidos registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">kg Total</TableHead>
                      <TableHead>Pago</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Transporte</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...pedidos].reverse().map((p) => (
                      <TableRow key={p.id_pedido}>
                        <TableCell className="font-mono font-medium">{p.id_pedido}</TableCell>
                        <TableCell>{p.fecha}</TableCell>
                        <TableCell>{p.cliente.nombre}</TableCell>
                        <TableCell>
                          <Badge variant={p.cliente.tipo === "Mayorista" ? "default" : "secondary"}>
                            {p.cliente.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{p.cantidad} {p.unidad}</TableCell>
                        <TableCell className="text-right">{p.kg_total} kg</TableCell>
                        <TableCell>{p.metodo_pago}</TableCell>
                        <TableCell className="text-right font-medium">{fmt(p.total)}</TableCell>
                        <TableCell>{p.medio_transporte}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
