import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class RegistroDto {
  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  @IsOptional()
  celular?: string;

  @IsString()
  @MinLength(6)
  contrasena: string;
}