import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  crear(@Body() dto: CrearPedidoDto) {
    return this.pedidosService.crear(dto);
  }

  @Get()
  obtenerTodos() {
    return this.pedidosService.obtenerTodos();
  }

  @Get('usuario/:usuarioId')
  obtenerPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.pedidosService.obtenerPorUsuario(usuarioId);
  }

  @Get('qr/:qrToken')
  verificarQr(@Param('qrToken') qrToken: string) {
    return this.pedidosService.verificarQr(qrToken);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.pedidosService.obtenerPorId(id);
  }

  @Patch(':id/estado')
  actualizarEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.pedidosService.actualizarEstado(id, estado);
  }
}