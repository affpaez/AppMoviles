export interface Usuario {
  id: string
  nombre: string
  correo: string
  celular?: string
  rol: string
  creadoEn: string
}

export interface Categoria {
  id: string
  nombre: string
  productos?: Producto[]
}

export interface Ingrediente {
  id: string
  nombre: string
  iconoUrl?: string
  productoId: string
}

export interface Extra {
  id: string
  nombre: string
  precio: number
  productoId: string
}

export interface Producto {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  imagenUrl?: string
  disponible: boolean
  esProductoDelDia: boolean
  esPopular: boolean
  calorias?: number
  gramos?: number
  proteinas?: number
  carbohidratos?: number
  grasas?: number
  categoriaId: string
  categoria: Categoria
  ingredientes: Ingrediente[]
  extras: Extra[]
}

export interface ItemCarrito {
  producto: Producto
  cantidad: number
  precio: number
  comentario: string
  extras: Extra[]
}

export interface Tarjeta {
  id: string
  usuarioId: string
  ultimosDigitos: string
  nombreTitular: string
  fechaExp: string
  marca?: string
  pagoPorDefecto: boolean
  creadoEn: string
}

export interface Pago {
  id: string
  pedidoId: string
  monto: number
  estado: 'PENDIENTE' | 'PAGADO' | 'FALLIDO'
  metodoPago?: 'EFECTIVO' | 'TARJETA'
  tarjetaId?: string
  codigo?: string
  pagadoEn?: string
}

export interface Descuento {
  id: string
  codigo: string
  porcentaje: number
  activo: boolean
  fechaExpiracion?: string
}
