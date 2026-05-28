import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TarjetasService } from './tarjetas.service';
import { CrearTarjetaDto } from './dto/crear-tarjeta.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';

@Controller('tarjetas')
export class TarjetasController {
  constructor(private readonly tarjetasService: TarjetasService) {}

  @Post()
  crear(@Body() dto: CrearTarjetaDto, @AuthUser() user: { userId: string }) {
    return this.tarjetasService.crear(user.userId, dto);
  }

  @Get()
  listar(@AuthUser() user: { userId: string }) {
    return this.tarjetasService.listar(user.userId);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string, @AuthUser() user: { userId: string }) {
    return this.tarjetasService.eliminar(id, user.userId);
  }

  @Patch(':id/defecto')
  marcarDefecto(@Param('id') id: string, @AuthUser() user: { userId: string }) {
    return this.tarjetasService.marcarDefecto(id, user.userId);
  }
}
