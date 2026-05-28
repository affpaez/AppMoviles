export class Pedido {
  id: string;
  usuarioId: string;
  estado: string;
  subtotal: number;
  iva: number;
  propina: number;
  total: number;
  tiempoEstimado?: number;
  qrToken?: string;
  creadoEn: Date;
}