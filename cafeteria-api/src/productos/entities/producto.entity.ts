export class Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
  disponible: boolean;
  esProductoDelDia: boolean;
  esPopular: boolean;
  calorias?: number;
  gramos?: number;
  proteinas?: number;
  carbohidratos?: number;
  grasas?: number;
  categoriaId: string;
}