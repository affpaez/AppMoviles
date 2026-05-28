import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearTarjetaDto } from './dto/crear-tarjeta.dto';

@Injectable()
export class TarjetasService {
  constructor(private prisma: PrismaService) {}

  async crear(usuarioId: string, dto: CrearTarjetaDto) {
    const ultimosDigitos = dto.numero.slice(-4);
    const tarjetasExistentes = await this.prisma.tarjeta.count({
      where: { usuarioId },
    });

    return this.prisma.tarjeta.create({
      data: {
        usuarioId,
        ultimosDigitos,
        nombreTitular: dto.nombreTitular,
        fechaExp: dto.fechaExp,
        pagoPorDefecto: tarjetasExistentes === 0,
      },
    });
  }

  async listar(usuarioId: string) {
    return this.prisma.tarjeta.findMany({
      where: { usuarioId },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async eliminar(id: string, usuarioId: string) {
    const tarjeta = await this.prisma.tarjeta.findUnique({ where: { id } });
    if (!tarjeta) throw new NotFoundException('Tarjeta no encontrada');
    if (tarjeta.usuarioId !== usuarioId) {
      throw new ForbiddenException('No puedes eliminar una tarjeta que no te pertenece');
    }

    return this.prisma.tarjeta.delete({ where: { id } });
  }

  async marcarDefecto(id: string, usuarioId: string) {
    const tarjeta = await this.prisma.tarjeta.findUnique({ where: { id } });
    if (!tarjeta) throw new NotFoundException('Tarjeta no encontrada');
    if (tarjeta.usuarioId !== usuarioId) {
      throw new ForbiddenException('No puedes modificar esta tarjeta');
    }

    await this.prisma.tarjeta.updateMany({
      where: { usuarioId },
      data: { pagoPorDefecto: false },
    });

    return this.prisma.tarjeta.update({
      where: { id },
      data: { pagoPorDefecto: true },
    });
  }
}
