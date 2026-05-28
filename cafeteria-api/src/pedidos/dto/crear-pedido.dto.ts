import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearItemExtraDto {
  @IsString()
  extraId: string;

  @IsNumber()
  precio: number;
}

export class CrearItemPedidoDto {
  @IsString()
  productoId: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio: number;

  @IsString()
  @IsOptional()
  comentario?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CrearItemExtraDto)
  extras?: CrearItemExtraDto[];
}

export class CrearPedidoDto {
  @IsString()
  usuarioId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearItemPedidoDto)
  items: CrearItemPedidoDto[];

  @IsNumber()
  @IsOptional()
  propina?: number;

  @IsString()
  @IsOptional()
  descuentoId?: string;
}