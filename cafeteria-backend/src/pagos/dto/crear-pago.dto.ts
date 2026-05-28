import { IsString, IsOptional } from 'class-validator';

export class CrearPagoDto {
  @IsString()
  pedidoId: string;

  @IsString()
  metodoPago: string;

  @IsString()
  @IsOptional()
  tarjetaId?: string;
}
