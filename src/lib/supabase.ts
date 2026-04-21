import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- Tipos que coinciden con tus tablas en Supabase ---

export type Producto = {
  id: string
  nombre: string
  descripcion: string
  precio_unidad: number
  precio_caja: number
  unidades_por_caja: number
  imagen_url: string
  activo: boolean
}

export type ItemPedido = {
  producto_id: string
  nombre: string
  cantidad: number
  tipo_venta: 'unidad' | 'caja'
  precio_unitario: number
  subtotal: number
}

export type NuevoPedido = {
  cliente_nombre: string
  cliente_contacto: string
  cliente_direccion: string
  cliente_tipo: 'Minorista' | 'Mayorista'
  metodo_pago: 'Efectivo' | 'Transferencia' | 'Cuenta corriente'
  items: ItemPedido[]
  total: number
  estado: string
  id_web: string
}

export type NuevoCliente = {
  nombre: string
  contacto: string
  direccion: string
  tipo: 'Minorista' | 'Mayorista'
  origen: string
}

// --- Funciones de acceso a datos ---

export async function fetchProductosActivos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('nombre')

  if (error) throw error
  return data ?? []
}

export async function insertarPedido(pedido: NuevoPedido) {
  const { data, error } = await supabase
    .from('pedidos')
    .insert([pedido])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function upsertCliente(cliente: NuevoCliente) {
  const { data, error } = await supabase
    .from('clientes')
    .upsert([cliente], { onConflict: 'contacto' })
    .select()
    .single()

  if (error) throw error
  return data
}
