from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os
import datetime
import asyncio
import httpx

app = FastAPI(title="Sistema de Pedidos - Lechuga Fresca", version="4.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Constantes ───────────────────────────────────────────────
STOCK_INICIAL     = 5000
ARCHIVO_PEDIDOS   = "pedidos.json"
ARCHIVO_STOCK     = "stock.json"
ARCHIVO_PRODUCTOS = "productos.json"
HYDROGEST_URL     = os.getenv("HYDROGEST_URL", "https://id-preview--8a7043b5-eb5d-493f-903d-cdc046b8ebf0.lovable.app/")

# ─── Schemas ──────────────────────────────────────────────────

class ProductoSchema(BaseModel):
    nombre: str
    descripcion: Optional[str] = ""
    precio_unidad: float
    precio_caja: float
    unidades_por_caja: int = 12
    stock: float = 0
    unidad: str = "unidad"        # "unidad" | "kg"
    imagen_url: Optional[str] = ""
    activo: bool = True

class ClienteSchema(BaseModel):
    nombre: str
    contacto: str
    direccion: str
    tipo: str                     # "Minorista" | "Mayorista"

class ItemPedidoSchema(BaseModel):
    producto_id: str
    nombre: str
    cantidad: int
    tipo_venta: str               # "unidad" | "caja"
    precio_unitario: float
    subtotal: float

class NuevoPedidoSchema(BaseModel):
    cliente: ClienteSchema
    items: list[ItemPedidoSchema]
    metodo_pago: str

class AjusteStockSchema(BaseModel):
    nuevo_stock_kg: float

class AjusteStockProductoSchema(BaseModel):
    stock: float

# ─── Helpers productos ────────────────────────────────────────

def leer_productos() -> list:
    if not os.path.exists(ARCHIVO_PRODUCTOS):
        return []
    try:
        with open(ARCHIVO_PRODUCTOS, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def guardar_productos(productos: list):
    with open(ARCHIVO_PRODUCTOS, "w", encoding="utf-8") as f:
        json.dump(productos, f, indent=2, ensure_ascii=False)

def generar_id() -> str:
    return datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")

# ─── Helpers pedidos / stock ──────────────────────────────────

def leer_stock() -> float:
    if os.path.exists(ARCHIVO_STOCK):
        try:
            with open(ARCHIVO_STOCK, "r", encoding="utf-8") as f:
                return json.load(f).get("stock_kg", STOCK_INICIAL)
        except Exception:
            pass
    return STOCK_INICIAL

def guardar_stock(stock_kg: float):
    with open(ARCHIVO_STOCK, "w", encoding="utf-8") as f:
        json.dump({"stock_kg": stock_kg}, f, indent=2)

def leer_pedidos() -> list:
    if not os.path.exists(ARCHIVO_PEDIDOS):
        return []
    try:
        with open(ARCHIVO_PEDIDOS, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def guardar_pedidos(pedidos: list):
    with open(ARCHIVO_PEDIDOS, "w", encoding="utf-8") as f:
        json.dump(pedidos, f, indent=2, ensure_ascii=False)

def obtener_ultimo_id(pedidos: list) -> int:
    if not pedidos:
        return 0
    try:
        return max(int(p["id_pedido"].split("-")[1]) for p in pedidos)
    except Exception:
        return 0

def asignar_transporte(tipo_cliente: str, total: float) -> str:
    if tipo_cliente == "Mayorista" or total >= 5000:
        return "Camión"
    return "Reparto local"

# ─── Notificación a contabilidad ─────────────────────────────

async def notificar_contabilidad(pedido: dict):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(f"{HYDROGEST_URL}/api/webhook/pedido", json=pedido)
            print(f"[Contabilidad] Pedido {pedido['id_pedido']} notificado")
    except Exception as e:
        print(f"[Contabilidad] Error (no crítico): {e}")


# ═════════════════════════════════════════════════════════════
# ENDPOINTS
# ═════════════════════════════════════════════════════════════

@app.get("/")
def raiz():
    return {
        "mensaje": "API Lechuga Fresca ✅",
        "version": "4.0.0",
        "endpoints": [
            "GET    /productos          → catálogo completo",
            "POST   /productos          → crear producto (desde contabilidad)",
            "PUT    /productos/{id}     → editar producto (desde contabilidad)",
            "DELETE /productos/{id}     → eliminar producto",
            "PATCH  /productos/{id}/stock → actualizar stock de un producto",
            "GET    /stock              → stock general kg",
            "PUT    /stock              → ajustar stock general",
            "GET    /pedidos            → listar pedidos",
            "GET    /pedidos/sync       → sync para contabilidad",
            "POST   /pedidos            → crear pedido",
            "GET    /reporte            → reporte diario",
        ]
    }


# ══════════════════════════════════════════════════════════════
# PRODUCTOS — CRUD completo manejado desde web contabilidad
# ══════════════════════════════════════════════════════════════

@app.get("/productos")
def listar_productos(solo_activos: bool = False):
    """
    Web de VENTAS llama esto para mostrar el catálogo.
    Web de CONTABILIDAD llama esto para gestionar el inventario.
    """
    productos = leer_productos()
    if solo_activos:
        productos = [p for p in productos if p.get("activo", True)]
    return {"total": len(productos), "productos": productos}


@app.post("/productos", status_code=201)
def crear_producto(body: ProductoSchema):
    """Crear producto nuevo desde la web de contabilidad."""
    if body.precio_unidad <= 0 or body.precio_caja <= 0:
        raise HTTPException(status_code=400, detail="Los precios deben ser mayores a 0")

    productos = leer_productos()

    if any(p["nombre"].lower() == body.nombre.lower() for p in productos):
        raise HTTPException(status_code=409, detail=f"Ya existe '{body.nombre}'")

    nuevo = {
        "id":                generar_id(),
        "nombre":            body.nombre,
        "descripcion":       body.descripcion,
        "precio_unidad":     body.precio_unidad,
        "precio_caja":       body.precio_caja,
        "unidades_por_caja": body.unidades_por_caja,
        "stock":             body.stock,
        "unidad":            body.unidad,
        "imagen_url":        body.imagen_url,
        "activo":            body.activo,
        "creado":            datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
    }
    productos.append(nuevo)
    guardar_productos(productos)
    return {"mensaje": "Producto creado ✅", "producto": nuevo}


@app.put("/productos/{producto_id}")
def editar_producto(producto_id: str, body: ProductoSchema):
    """Editar nombre, descripción, precios, stock, imagen, estado."""
    productos = leer_productos()
    idx = next((i for i, p in enumerate(productos) if p["id"] == producto_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    productos[idx].update({
        "nombre":            body.nombre,
        "descripcion":       body.descripcion,
        "precio_unidad":     body.precio_unidad,
        "precio_caja":       body.precio_caja,
        "unidades_por_caja": body.unidades_por_caja,
        "stock":             body.stock,
        "unidad":            body.unidad,
        "imagen_url":        body.imagen_url,
        "activo":            body.activo,
        "actualizado":       datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
    })
    guardar_productos(productos)
    return {"mensaje": "Producto actualizado ✅", "producto": productos[idx]}


@app.delete("/productos/{producto_id}")
def eliminar_producto(producto_id: str):
    """Eliminar producto. Si tiene historial, mejor desactivarlo (activo: false)."""
    productos = leer_productos()
    nuevos = [p for p in productos if p["id"] != producto_id]
    if len(nuevos) == len(productos):
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    guardar_productos(nuevos)
    return {"mensaje": "Producto eliminado ✅"}


@app.patch("/productos/{producto_id}/stock")
def actualizar_stock_producto(producto_id: str, body: AjusteStockProductoSchema):
    """Actualizar solo el stock de un producto (sin tocar precio ni descripción)."""
    productos = leer_productos()
    idx = next((i for i, p in enumerate(productos) if p["id"] == producto_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if body.stock < 0:
        raise HTTPException(status_code=400, detail="El stock no puede ser negativo")
    productos[idx]["stock"] = body.stock
    guardar_productos(productos)
    return {"mensaje": "Stock actualizado ✅", "producto_id": producto_id, "stock": body.stock}


# ══════════════════════════════════════════════════════════════
# STOCK GENERAL (materia prima en kg)
# ══════════════════════════════════════════════════════════════

@app.get("/stock")
def ver_stock():
    return {"stock_kg": leer_stock()}

@app.put("/stock")
def ajustar_stock(body: AjusteStockSchema):
    if body.nuevo_stock_kg < 0:
        raise HTTPException(status_code=400, detail="El stock no puede ser negativo")
    guardar_stock(body.nuevo_stock_kg)
    return {"mensaje": "Stock actualizado ✅", "stock_kg": body.nuevo_stock_kg}


# ══════════════════════════════════════════════════════════════
# PEDIDOS
# ══════════════════════════════════════════════════════════════

@app.get("/pedidos")
def listar_pedidos(limite: int = 50, tipo: Optional[str] = None):
    pedidos = leer_pedidos()
    if tipo:
        pedidos = [p for p in pedidos if p["cliente"]["tipo"] == tipo]
    return {"total": len(pedidos), "pedidos": pedidos[-limite:]}


@app.get("/pedidos/sync")
def sync_para_contabilidad(desde: Optional[str] = None):
    """La web de contabilidad llama esto para sincronizar clientes y ventas."""
    pedidos = leer_pedidos()
    if desde:
        pedidos = [p for p in pedidos if p["fecha"] >= desde]
    resultado = []
    for p in pedidos:
        resultado.append({
            **p,
            "para_contabilidad": {
                "cliente": {
                    "nombre":    p["cliente"]["nombre"],
                    "telefono":  p["cliente"]["contacto"],
                    "direccion": p["cliente"]["direccion"],
                    "tipo":      p["cliente"]["tipo"],
                },
                "venta": {
                    "id_pedido_origen": p["id_pedido"],
                    "fecha":            p["fecha"],
                    "items":            p.get("items", []),
                    "total":            p["total"],
                    "metodo_pago":      p["metodo_pago"],
                }
            }
        })
    return {"total": len(resultado), "pedidos": resultado}


@app.get("/pedidos/{id_pedido}")
def obtener_pedido(id_pedido: str):
    for p in leer_pedidos():
        if p["id_pedido"] == id_pedido:
            return p
    raise HTTPException(status_code=404, detail=f"Pedido {id_pedido} no encontrado")


@app.post("/pedidos", status_code=201)
async def crear_pedido(body: NuevoPedidoSchema):
    if body.cliente.tipo not in ["Minorista", "Mayorista"]:
        raise HTTPException(status_code=400, detail="Tipo de cliente inválido. Use 'Minorista' o 'Mayorista'")
    if body.metodo_pago not in ["Efectivo", "Transferencia", "Cuenta corriente"]:
        raise HTTPException(status_code=400, detail="Método de pago inválido")
    if not body.items:
        raise HTTPException(status_code=400, detail="El pedido debe tener al menos un producto")

    total      = sum(item.subtotal for item in body.items)
    transporte = asignar_transporte(body.cliente.tipo, total)
    pedidos    = leer_pedidos()
    nuevo_id   = obtener_ultimo_id(pedidos) + 1
    id_pedido  = f"PED-{nuevo_id:04d}"
    fecha      = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    pedido = {
        "id_pedido":        id_pedido,
        "fecha":            fecha,
        "cliente":          body.cliente.model_dump(),
        "items":            [i.model_dump() for i in body.items],
        "metodo_pago":      body.metodo_pago,
        "total":            total,
        "medio_transporte": transporte,
    }

    pedidos.append(pedido)
    guardar_pedidos(pedidos)

    # Descontar stock de cada producto
    productos = leer_productos()
    for item in body.items:
        idx = next((i for i, p in enumerate(productos) if p["id"] == item.producto_id), None)
        if idx is not None:
            cantidad_real = item.cantidad * (productos[idx]["unidades_por_caja"] if item.tipo_venta == "caja" else 1)
            productos[idx]["stock"] = max(0, productos[idx].get("stock", 0) - cantidad_real)
    guardar_productos(productos)

    asyncio.create_task(notificar_contabilidad(pedido))

    return {"mensaje": "Pedido creado exitosamente ✅", "pedido": pedido}


# ══════════════════════════════════════════════════════════════
# REPORTE
# ══════════════════════════════════════════════════════════════

@app.get("/reporte")
def reporte_diario(fecha: Optional[str] = None):
    if fecha is None:
        fecha = datetime.datetime.now().strftime("%Y-%m-%d")
    pedidos     = leer_pedidos()
    pedidos_dia = [p for p in pedidos if p["fecha"].startswith(fecha)]
    minorista   = [p for p in pedidos_dia if p["cliente"]["tipo"] == "Minorista"]
    mayorista   = [p for p in pedidos_dia if p["cliente"]["tipo"] == "Mayorista"]
    return {
        "fecha":          fecha,
        "total_pedidos":  len(pedidos_dia),
        "total_ingresos": sum(p["total"] for p in pedidos_dia),
        "minorista": {
            "pedidos":  len(minorista),
            "ingresos": sum(p["total"] for p in minorista),
        },
        "mayorista": {
            "pedidos":  len(mayorista),
            "ingresos": sum(p["total"] for p in mayorista),
        },
    }
