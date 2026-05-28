import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearCategoriaDto } from './dto/crear-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearCategoriaDto) {
    return this.prisma.categoria.create({ data: dto });
  }

  async obtenerTodas() {
    return this.prisma.categoria.findMany({
      include: { productos: true },
    });
  }

  async obtenerPorId(id: string) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: { productos: true },
    });

    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    return categoria;
  }

  async actualizar(id: string, dto: CrearCategoriaDto) {
    await this.obtenerPorId(id);

    return this.prisma.categoria.update({
      where: { id },
      data: dto,
    });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    await this.prisma.categoria.delete({ where: { id } });
    return { mensaje: 'Categoría eliminada correctamente' };
  }
}