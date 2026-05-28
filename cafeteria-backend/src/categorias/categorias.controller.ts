import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CrearCategoriaDto } from './dto/crear-categoria.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Roles(Rol.ADMIN)
  @Post()
  crear(@Body() dto: CrearCategoriaDto) {
    return this.categoriasService.crear(dto);
  }

  @Public()
  @Get()
  obtenerTodas() {
    return this.categoriasService.obtenerTodas();
  }

  @Public()
  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.categoriasService.obtenerPorId(id);
  }

  @Roles(Rol.ADMIN)
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: CrearCategoriaDto) {
    return this.categoriasService.actualizar(id, dto);
  }

  @Roles(Rol.ADMIN)
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.categoriasService.eliminar(id);
  }
}
