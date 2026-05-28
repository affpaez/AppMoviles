import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  crear(@Body() dto: CrearProductoDto) {
    return this.productosService.crear(dto);
  }

  @Get()
  obtenerTodos() {
    return this.productosService.obtenerTodos();
  }

  @Get('producto-del-dia')
  obtenerProductoDelDia() {
    return this.productosService.obtenerProductoDelDia();
  }

  @Get('populares')
  obtenerPopulares() {
    return this.productosService.obtenerPopulares();
  }

  @Get('buscar')
  buscar(@Query('nombre') nombre: string) {
    return this.productosService.buscar(nombre);
  }

  @Get('categoria/:categoriaId')
  filtrarPorCategoria(@Param('categoriaId') categoriaId: string) {
    return this.productosService.filtrarPorCategoria(categoriaId);
  }

  @Get('precio')
  filtrarPorPrecio(@Query('min') min: string, @Query('max') max: string) {
    return this.productosService.filtrarPorPrecio(Number(min), Number(max));
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.productosService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarProductoDto) {
    return this.productosService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.productosService.eliminar(id);
  }
}