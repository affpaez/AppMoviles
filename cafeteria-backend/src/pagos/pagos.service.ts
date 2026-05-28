import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPagoDto } from './dto/crear-pago.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  async procesar(dto: CrearPagoDto) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id: dto.pedidoId },
    });

    if (!pedido) throw new NotFoundException('Pedido no encontrado');

    const pagoExistente = await this.prisma.pago.findUnique({
      where: { pedidoId: dto.pedidoId },
    });

    if (pagoExistente) {
      throw new BadRequestException('Este pedido ya tiene un pago registrado');
    }

    if (dto.metodoPago === 'TARJETA' && dto.tarjetaId) {
      const tarjeta = await this.prisma.tarjeta.findUnique({
        where: { id: dto.tarjetaId },
      });
      if (!tarjeta) throw new NotFoundException('Tarjeta no encontrada');
    }

    const codigo = dto.metodoPago === 'TARJETA' ? uuidv4().replace(/-/g, '').toUpperCase().slice(0, 12) : null;

    return this.prisma.pago.create({
      data: {
        pedidoId: dto.pedidoId,
        monto: pedido.total,
        estado: 'PAGADO',
        metodoPago: dto.metodoPago as any,
        tarjetaId: dto.tarjetaId ?? null,
        codigo,
        pagadoEn: new Date(),
      },
    });
  }

  async obtenerPorId(id: string) {
    const pago = await this.prisma.pago.findUnique({
      where: { id },
      include: { pedido: true },
    });

    if (!pago) throw new NotFoundException('Pago no encontrado');
    return pago;
  }

  async obtenerPorPedido(pedidoId: string) {
    const pago = await this.prisma.pago.findUnique({
      where: { pedidoId },
      include: { pedido: true },
    });

    if (!pago) throw new NotFoundException('Pago no encontrado para este pedido');
    return pago;
  }
}
