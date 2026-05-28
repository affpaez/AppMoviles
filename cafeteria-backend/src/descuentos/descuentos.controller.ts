import { Controller, Get, Post, Body } from '@nestjs/common';
import { DescuentosService } from './descuentos.service';
import { ValidarDescuentoDto } from './dto/validar-descuento.dto';
import { CrearDescuentoDto } from './dto/crear-descuento.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('descuentos')
export class DescuentosController {
  constructor(private readonly descuentosService: DescuentosService) {}

  @Public()
  @Post('validar')
  validar(@Body() dto: ValidarDescuentoDto) {
    return this.descuentosService.validar(dto.codigo);
  }

  @Roles(Rol.ADMIN)
  @Post()
  crear(@Body() dto: CrearDescuentoDto) {
    return this.descuentosService.crear(dto);
  }

  @Roles(Rol.ADMIN)
  @Get()
  listar() {
    return this.descuentosService.listar();
  }
}
