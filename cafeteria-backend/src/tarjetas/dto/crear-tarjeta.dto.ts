import { IsString } from 'class-validator';

export class CrearTarjetaDto {
  @IsString()
  numero: string;

  @IsString()
  nombreTitular: string;

  @IsString()
  fechaExp: string;
}
