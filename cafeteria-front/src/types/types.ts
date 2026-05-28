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
