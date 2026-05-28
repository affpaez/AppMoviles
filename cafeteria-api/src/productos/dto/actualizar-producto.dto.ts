import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class ActualizarProductoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  precio?: number;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;

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
  @IsOptional()
  categoriaId?: string;
}