import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async obtenerTodos() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        correo: true,
        celular: true,
        rol: true,
        creadoEn: true,
      },
    });
  }

  async obtenerPorId(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        correo: true,
        celular: true,
        rol: true,
        creadoEn: true,
      },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return usuario;
  }

  async actualizar(id: string, dto: ActualizarUsuarioDto) {
    await this.obtenerPorId(id);

    return this.prisma.usuario.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        nombre: true,
        correo: true,
        celular: true,
        rol: true,
      },
    });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    await this.prisma.usuario.delete({ where: { id } });
    return { mensaje: 'Usuario eliminado correctamente' };
  }
}