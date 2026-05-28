import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registro(dto: RegistroDto) {
    // Verificar si el correo ya existe
    const usuarioExiste = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });

    if (usuarioExiste) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Encriptar contraseña
    const contrasenaHash = await bcrypt.hash(dto.contrasena, 10);

    // Crear usuario
    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        correo: dto.correo,
        celular: dto.celular,
        contrasena: contrasenaHash,
      },
    });

    // Generar token
    const token = this.generarToken(usuario.id, usuario.rol);

    return { token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol } };
  }

  async login(dto: LoginDto) {
    // Buscar usuario
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(dto.contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Generar token
    const token = this.generarToken(usuario.id, usuario.rol);

    return { token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol } };
  }

  private generarToken(usuarioId: string, rol: string) {
    return this.jwtService.sign({ sub: usuarioId, rol });
  }
}