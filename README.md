# 🥬 API de Pedidos - Lechuga Fresca

API REST construida con **FastAPI** (Python). Se conecta con cualquier frontend web, incluyendo Lovable.

---

## 📦 Instalación local

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Documentación automática disponible en: `http://localhost:8000/docs`

---

## 🚀 Deploy en Render (gratuito)

1. Subí estos archivos a un repo de GitHub (`main.py`, `requirements.txt`)
2. Entrá a [render.com](https://render.com) → New → Web Service
3. Conectá tu repo
4. Configurá:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy → Render te da una URL pública tipo `https://tu-api.onrender.com`

---

## 🔗 Conectar con Lovable

En tu proyecto de Lovable, usás `fetch` para llamar a la API:

```javascript
const BASE_URL = "https://tu-api.onrender.com"; // ← reemplazá con tu URL real

// Ver stock
const stock = await fetch(`${BASE_URL}/stock`).then(r => r.json());

// Crear pedido
const res = await fetch(`${BASE_URL}/pedidos`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    cliente: {
      nombre: "Juan Pérez",
      contacto: "11-1234-5678",
      direccion: "Av. Siempreviva 742",
      tipo: "Minorista"
    },
    cantidad: 25,
    unidad: "kg",
    metodo_pago: "Efectivo"
  })
});
const pedido = await res.json();

// Reporte del día
const reporte = await fetch(`${BASE_URL}/reporte`).then(r => r.json());

// Listar pedidos
const lista = await fetch(`${BASE_URL}/pedidos?limite=20`).then(r => r.json());
```

---

## 📡 Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/stock` | Ver stock actual |
| PUT | `/stock` | Ajustar stock manualmente |
| GET | `/pedidos` | Listar pedidos (query: `limite`, `tipo`) |
| GET | `/pedidos/{id}` | Ver un pedido específico |
| POST | `/pedidos` | Crear nuevo pedido |
| GET | `/reporte` | Reporte diario (query: `fecha=YYYY-MM-DD`) |

---

## ⚠️ Antes de producción

- En `main.py`, reemplazá `allow_origins=["*"]` por tu URL de Lovable:
  ```python
  allow_origins=["https://tu-proyecto.lovable.app"]
  ```
- Considerá migrar de JSON a SQLite o PostgreSQL para mayor robustez
