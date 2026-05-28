import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearProductoDto) {
    return this.prisma.producto.create({
      data: dto,
      include: { categoria: true, ingredientes: true, extras: true },
    });
  }

  async obtenerTodos() {
    return this.prisma.producto.findMany({
      include: { categoria: true, ingredientes: true, extras: true },
    });
  }

  async obtenerPorId(id: string) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { categoria: true, ingredientes: true, extras: true },
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');

    return producto;
  }

  async obtenerProductoDelDia() {
    const producto = await this.prisma.producto.findFirst({
      where: { esProductoDelDia: true, disponible: true },
      include: { categoria: true },
    });

    if (!producto) throw new NotFoundException('No hay producto del día');

    return producto;
  }

  async obtenerPopulares() {
    return this.prisma.producto.findMany({
      where: { esPopular: true, disponible: true },
      include: { categoria: true },
    });
  }

  async buscar(nombre: string) {
    return this.prisma.producto.findMany({
      where: {
        nombre: { contains: nombre, mode: 'insensitive' },
        disponible: true,
      },
      include: { categoria: true },
    });
  }

  async filtrarPorCategoria(categoriaId: string) {
    return this.prisma.producto.findMany({
      where: { categoriaId, disponible: true },
      include: { categoria: true },
    });
  }

  async filtrarPorPrecio(min: number, max: number) {
    return this.prisma.producto.findMany({
      where: {
        precio: { gte: min, lte: max },
        disponible: true,
      },
      include: { categoria: true },
    });
  }

  async actualizar(id: string, dto: ActualizarProductoDto) {
    await this.obtenerPorId(id);

    return this.prisma.producto.update({
      where: { id },
      data: dto,
      include: { categoria: true, ingredientes: true, extras: true },
    });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    await this.prisma.producto.delete({ where: { id } });
    return { mensaje: 'Producto eliminado correctamente' };
  }
}