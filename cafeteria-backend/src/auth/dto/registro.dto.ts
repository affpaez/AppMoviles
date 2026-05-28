import { IsEmail, IsString, IsOptional, MinLength, Matches } from 'class-validator';

export class RegistroDto {
  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{10}$/, { message: 'El celular debe tener exactamente 10 dígitos' })
  celular?: string;

  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    { message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial' },
  )
  contrasena: string;
}