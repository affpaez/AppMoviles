import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CrearDescuentoDto {
  @IsString()
  codigo: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  porcentaje: number;

  @IsString()
  @IsOptional()
  fechaExpiracion?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  maximoUsos?: number;
}
