import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CrearProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  precio: number;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsBoolean()
  @IsOptional()
  esProductoDelDia?: boolean;

  @IsBoolean()
  @IsOptional()
  esPopular?: boolean;

  @IsNumber()
  @IsOptional()
  calorias?: number;

  @IsNumber()
  @IsOptional()
  gramos?: number;

  @IsNumber()
  @IsOptional()
  proteinas?: number;

  @IsNumber()
  @IsOptional()
  carbohidratos?: number;

  @IsNumber()
  @IsOptional()
  grasas?: number;

  @IsString()
  categoriaId: string;
}