import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { v4 as uuidv4 } from 'uuid';

const IVA = 0.08;

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearPedidoDto) {
    // Calcular subtotal
    const subtotal = dto.items.reduce((acc, item) => {
      const extrasTotal = item.extras?.reduce((a, e) => a + e.precio, 0) ?? 0;
      return acc + (item.precio * item.cantidad) + extrasTotal;
    }, 0);

    const iva = subtotal * IVA;
    const propina = dto.propina ?? 0;
    const total = subtotal + iva + propina;
    const qrToken = uuidv4();

    return this.prisma.pedido.create({
      data: {
        usuarioId: dto.usuarioId,
        subtotal,
        iva,
        propina,
        total,
        qrToken,
        descuentoId: dto.descuentoId,
        items: {
          create: dto.items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precio: item.precio,
            comentario: item.comentario,
            extras: {
              create: item.extras?.map((extra) => ({
                extraId: extra.extraId,
                precio: extra.precio,
              })) ?? [],
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            producto: true,
            extras: { include: { extra: true } },
          },
        },
      },
    });
  }

  async obtenerTodos() {
    return this.prisma.pedido.findMany({
      include: {
        usuario: { select: { id: true, nombre: true, correo: true } },
        items: { include: { producto: true } },
      },
    });
  }

  async obtenerPorUsuario(usuarioId: string) {
    return this.prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        items: { include: { producto: true } },
      },
    });
  }

  async obtenerPorId(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nombre: true, correo: true } },
        items: {
          include: {
            producto: true,
            extras: { include: { extra: true } },
          },
        },
        pago: true,
      },
    });

    if (!pedido) throw new NotFoundException('Pedido no encontrado');

    return pedido;
  }

  async actualizarEstado(id: string, estado: string) {
    await this.obtenerPorId(id);

    return this.prisma.pedido.update({
      where: { id },
      data: { estado: estado as any },
    });
  }

  async verificarQr(qrToken: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { qrToken },
      include: {
        usuario: { select: { id: true, nombre: true } },
        items: { include: { producto: true } },
      },
    });

    if (!pedido) throw new NotFoundException('QR inválido');

    return pedido;
  }
}