import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearDescuentoDto } from './dto/crear-descuento.dto';

@Injectable()
export class DescuentosService {
  constructor(private prisma: PrismaService) {}

  async validar(codigo: string) {
    const descuento = await this.prisma.descuento.findUnique({
      where: { codigo },
    });

    if (!descuento) {
      return { valido: false, mensaje: 'Código de descuento inválido' };
    }

    if (!descuento.activo) {
      return { valido: false, mensaje: 'Este código de descuento ya no está activo' };
    }

    if (descuento.fechaExpiracion && new Date() > descuento.fechaExpiracion) {
      return { valido: false, mensaje: 'Este código de descuento ha expirado' };
    }

    if (descuento.maximoUsos && descuento.usosActuales >= descuento.maximoUsos) {
      return { valido: false, mensaje: 'Este código de descuento ha alcanzado el límite de usos' };
    }

    return {
      valido: true,
      porcentaje: descuento.porcentaje,
      descuentoId: descuento.id,
      mensaje: `Descuento del ${descuento.porcentaje}% aplicado`,
    };
  }

  async crear(dto: CrearDescuentoDto) {
    const existente = await this.prisma.descuento.findUnique({
      where: { codigo: dto.codigo },
    });

    if (existente) {
      throw new BadRequestException('Ya existe un descuento con ese código');
    }

    return this.prisma.descuento.create({
      data: {
        codigo: dto.codigo,
        porcentaje: dto.porcentaje,
        fechaExpiracion: dto.fechaExpiracion ? new Date(dto.fechaExpiracion) : null,
        maximoUsos: dto.maximoUsos ?? null,
      },
    });
  }

  async listar() {
    return this.prisma.descuento.findMany({
      orderBy: { creadoEn: 'desc' },
    });
  }
}
