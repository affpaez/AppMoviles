import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { Rol } from '@prisma/client';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Roles(Rol.ADMIN)
  @Get()
  obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Roles(Rol.ADMIN)
  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.usuariosService.obtenerPorId(id);
  }

  @Patch('me')
  actualizarPerfil(
    @AuthUser() user: { userId: string },
    @Body() dto: ActualizarUsuarioDto,
  ) {
    return this.usuariosService.actualizar(user.userId, dto);
  }

  @Roles(Rol.ADMIN)
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
    return this.usuariosService.actualizar(id, dto);
  }

  @Roles(Rol.ADMIN)
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.usuariosService.eliminar(id);
  }
}
