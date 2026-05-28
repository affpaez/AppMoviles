import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class ActualizarUsuarioDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  celular?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  contrasena?: string;
}