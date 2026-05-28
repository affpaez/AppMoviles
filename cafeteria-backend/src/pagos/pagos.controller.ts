import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CrearPagoDto } from './dto/crear-pago.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  procesar(@Body() dto: CrearPagoDto) {
    return this.pagosService.procesar(dto);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.pagosService.obtenerPorId(id);
  }

  @Get('pedido/:pedidoId')
  obtenerPorPedido(@Param('pedidoId') pedidoId: string) {
    return this.pagosService.obtenerPorPedido(pedidoId);
  }
}
