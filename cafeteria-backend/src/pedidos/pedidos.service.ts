import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { v4 as uuidv4 } from 'uuid';
import { EstadoPedido, Rol } from '@prisma/client';

const IVA = 0.08;

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearPedidoDto) {
    const subtotal = dto.items.reduce((acc, item) => {
      const extrasTotal = item.extras?.reduce((a, e) => a + e.precio, 0) ?? 0;
      return acc + (item.precio * item.cantidad) + extrasTotal;
    }, 0);

    let descuentoAplicado = 0;
    if (dto.descuentoId) {
      const descuento = await this.prisma.descuento.findUnique({
        where: { id: dto.descuentoId },
      });
      if (descuento?.activo) {
        descuentoAplicado = subtotal * (descuento.porcentaje / 100);
      }
    }

    const iva = subtotal * IVA;
    const propina = dto.propina ?? 0;
    const subtotalConDescuento = subtotal - descuentoAplicado;
    const ivaConDescuento = subtotalConDescuento * IVA;
    const total = subtotalConDescuento + ivaConDescuento + propina;
    const qrToken = uuidv4();

    return this.prisma.pedido.create({
      data: {
        usuarioId: dto.usuarioId,
        subtotal,
        iva: ivaConDescuento,
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

  async obtenerTodos(estado?: string, limit = 50, offset = 0) {
    const where: any = {};
    if (estado) where.estado = estado;

    return this.prisma.pedido.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { creadoEn: 'desc' },
      include: {
        usuario: { select: { id: true, nombre: true, correo: true } },
        items: { include: { producto: true } },
      },
    });
  }

  async obtenerPorUsuario(usuarioId: string) {
    return this.prisma.pedido.findMany({
      where: { usuarioId },
      orderBy: { creadoEn: 'desc' },
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

  async cancelar(id: string, usuarioId: string, rol: string) {
    const pedido = await this.obtenerPorId(id);

    if (rol !== Rol.ADMIN && pedido.usuarioId !== usuarioId) {
      throw new ForbiddenException('No puedes cancelar un pedido que no te pertenece');
    }
    if (pedido.estado !== EstadoPedido.PENDIENTE) {
      throw new BadRequestException('Solo se pueden cancelar pedidos pendientes');
    }

    return this.prisma.pedido.update({
      where: { id },
      data: { estado: EstadoPedido.CANCELADO },
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
