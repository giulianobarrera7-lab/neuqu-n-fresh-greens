from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os
import datetime

app = FastAPI(title="Sistema de Pedidos - Lechuga Fresca", version="1.0.0")

# CORS — permite que Lovable (u otro frontend) se conecte
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, reemplazá por tu URL de Lovable
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Constantes ───────────────────────────────────────────────
CAJON_A_KG = 10
PRECIO_MINORISTA_KG = 450
PRECIO_MAYORISTA_KG = 320
STOCK_INICIAL = 5000
ARCHIVO_PEDIDOS = "pedidos.json"
ARCHIVO_STOCK = "stock.json"

# ─── Schemas Pydantic ─────────────────────────────────────────

class ClienteSchema(BaseModel):
    nombre: str
    contacto: str
    direccion: str
    tipo: str  # "Minorista" | "Mayorista"

class NuevoPedidoSchema(BaseModel):
    cliente: ClienteSchema
    cantidad: float
    unidad: str        # "kg" | "cajon" | "cajones"
    metodo_pago: str   # "Efectivo" | "Transferencia" | "Cuenta corriente"

class AjusteStockSchema(BaseModel):
    nuevo_stock_kg: float

# ─── Helpers de archivos ──────────────────────────────────────

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
        json.dump({"producto": "Lechuga Fresca", "stock_kg": stock_kg}, f, indent=2, ensure_ascii=False)

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

def kg_total(cantidad: float, unidad: str) -> float:
    if unidad.lower() in ["cajon", "cajones"]:
        return cantidad * CAJON_A_KG
    return cantidad

def precio_por_kg(tipo_cliente: str) -> float:
    return PRECIO_MINORISTA_KG if tipo_cliente == "Minorista" else PRECIO_MAYORISTA_KG

def asignar_transporte(tipo_cliente: str, kg: float) -> str:
    if tipo_cliente == "Mayorista" or kg >= 100:
        return "Camión"
    return "Reparto local"

# ─── Endpoints ────────────────────────────────────────────────

@app.get("/")
def raiz():
    return {"mensaje": "API de Pedidos de Lechuga Fresca activa ✅", "version": "1.0.0"}


# ── Stock ──

@app.get("/stock")
def ver_stock():
    stock_kg = leer_stock()
    return {
        "producto": "Lechuga Fresca",
        "stock_kg": stock_kg,
        "stock_cajones": stock_kg / CAJON_A_KG,
        "precio_minorista_kg": PRECIO_MINORISTA_KG,
        "precio_mayorista_kg": PRECIO_MAYORISTA_KG,
    }

@app.put("/stock")
def ajustar_stock(body: AjusteStockSchema):
    if body.nuevo_stock_kg < 0:
        raise HTTPException(status_code=400, detail="El stock no puede ser negativo")
    guardar_stock(body.nuevo_stock_kg)
    return {"mensaje": "Stock actualizado", "stock_kg": body.nuevo_stock_kg}


# ── Pedidos ──

@app.get("/pedidos")
def listar_pedidos(limite: int = 50, tipo: Optional[str] = None):
    pedidos = leer_pedidos()
    if tipo:
        pedidos = [p for p in pedidos if p["cliente"]["tipo"] == tipo]
    return {"total": len(pedidos), "pedidos": pedidos[-limite:]}

@app.get("/pedidos/{id_pedido}")
def obtener_pedido(id_pedido: str):
    pedidos = leer_pedidos()
    for p in pedidos:
        if p["id_pedido"] == id_pedido:
            return p
    raise HTTPException(status_code=404, detail=f"Pedido {id_pedido} no encontrado")

@app.post("/pedidos", status_code=201)
def crear_pedido(body: NuevoPedidoSchema):
    # Validaciones
    if body.cliente.tipo not in ["Minorista", "Mayorista"]:
        raise HTTPException(status_code=400, detail="Tipo de cliente inválido. Use 'Minorista' o 'Mayorista'")
    if body.unidad.lower() not in ["kg", "cajon", "cajones"]:
        raise HTTPException(status_code=400, detail="Unidad inválida. Use 'kg' o 'cajon'")
    if body.metodo_pago not in ["Efectivo", "Transferencia", "Cuenta corriente"]:
        raise HTTPException(status_code=400, detail="Método de pago inválido")
    if body.cantidad <= 0:
        raise HTTPException(status_code=400, detail="La cantidad debe ser mayor a 0")

    stock_kg = leer_stock()
    kg = kg_total(body.cantidad, body.unidad)

    if stock_kg < kg:
        raise HTTPException(
            status_code=409,
            detail=f"Stock insuficiente. Disponible: {stock_kg:.1f} kg, solicitado: {kg:.1f} kg"
        )

    precio = precio_por_kg(body.cliente.tipo)
    total = kg * precio
    transporte = asignar_transporte(body.cliente.tipo, kg)

    pedidos = leer_pedidos()
    nuevo_id = obtener_ultimo_id(pedidos) + 1
    id_pedido = f"PED-{nuevo_id:04d}"
    fecha = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    pedido = {
        "id_pedido": id_pedido,
        "fecha": fecha,
        "cliente": body.cliente.model_dump(),
        "cantidad": body.cantidad,
        "unidad": body.unidad,
        "kg_total": kg,
        "precio_unitario": precio,
        "metodo_pago": body.metodo_pago,
        "total": total,
        "medio_transporte": transporte,
    }

    pedidos.append(pedido)
    guardar_pedidos(pedidos)
    guardar_stock(stock_kg - kg)

    return {"mensaje": "Pedido creado exitosamente", "pedido": pedido}


# ── Reporte ──

@app.get("/reporte")
def reporte_diario(fecha: Optional[str] = None):
    if fecha is None:
        fecha = datetime.datetime.now().strftime("%Y-%m-%d")

    pedidos = leer_pedidos()
    pedidos_dia = [p for p in pedidos if p["fecha"].startswith(fecha)]

    minorista = [p for p in pedidos_dia if p["cliente"]["tipo"] == "Minorista"]
    mayorista = [p for p in pedidos_dia if p["cliente"]["tipo"] == "Mayorista"]

    return {
        "fecha": fecha,
        "total_pedidos": len(pedidos_dia),
        "minorista": {
            "pedidos": len(minorista),
            "kg_vendidos": sum(p.get("kg_total", 0) for p in minorista),
            "ingresos": sum(p["total"] for p in minorista),
        },
        "mayorista": {
            "pedidos": len(mayorista),
            "kg_vendidos": sum(p.get("kg_total", 0) for p in mayorista),
            "ingresos": sum(p["total"] for p in mayorista),
        },
        "total_ingresos": sum(p["total"] for p in pedidos_dia),
        "total_kg_vendidos": sum(p.get("kg_total", 0) for p in pedidos_dia),
    }
