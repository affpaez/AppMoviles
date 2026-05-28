import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ForbiddenException } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { Rol } from '@prisma/client';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  crear(
    @Body() dto: CrearPedidoDto,
    @AuthUser() user: { userId: string },
  ) {
    return this.pedidosService.crear({ ...dto, usuarioId: user.userId });
  }

  @Roles(Rol.ADMIN)
  @Get()
  obtenerTodos() {
    return this.pedidosService.obtenerTodos();
  }

  @Get('usuario/:usuarioId')
  obtenerPorUsuario(
    @Param('usuarioId') usuarioId: string,
    @AuthUser() user: { userId: string; rol: string },
  ) {
    if (user.rol !== Rol.ADMIN && user.userId !== usuarioId) {
      throw new ForbiddenException('No puedes ver pedidos de otro usuario');
    }
    return this.pedidosService.obtenerPorUsuario(usuarioId);
  }

  @Public()
  @Get('qr/:qrToken')
  verificarQr(@Param('qrToken') qrToken: string) {
    return this.pedidosService.verificarQr(qrToken);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.pedidosService.obtenerPorId(id);
  }

  @Roles(Rol.ADMIN)
  @Patch(':id/estado')
  actualizarEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.pedidosService.actualizarEstado(id, estado);
  }

  @Delete(':id')
  cancelar(
    @Param('id') id: string,
    @AuthUser() user: { userId: string; rol: string },
  ) {
    return this.pedidosService.cancelar(id, user.userId, user.rol);
  }
}
