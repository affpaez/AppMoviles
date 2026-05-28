import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Roles(Rol.ADMIN)
  @Post()
  crear(@Body() dto: CrearProductoDto) {
    return this.productosService.crear(dto);
  }

  @Public()
  @Get()
  obtenerTodos(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productosService.obtenerTodos(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Public()
  @Get('producto-del-dia')
  obtenerProductosDelDia() {
    return this.productosService.obtenerProductosDelDia();
  }

  @Public()
  @Get('populares')
  obtenerPopulares() {
    return this.productosService.obtenerPopulares();
  }

  @Public()
  @Get('buscar')
  buscar(@Query('nombre') nombre: string) {
    return this.productosService.buscar(nombre);
  }

  @Public()
  @Get('categoria/:categoriaId')
  filtrarPorCategoria(
    @Param('categoriaId') categoriaId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productosService.filtrarPorCategoria(
      categoriaId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Public()
  @Get('precio')
  filtrarPorPrecio(@Query('min') min: string, @Query('max') max: string) {
    return this.productosService.filtrarPorPrecio(Number(min), Number(max));
  }

  @Public()
  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.productosService.obtenerPorId(id);
  }

  @Roles(Rol.ADMIN)
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarProductoDto) {
    return this.productosService.actualizar(id, dto);
  }

  @Roles(Rol.ADMIN)
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.productosService.eliminar(id);
  }
}
