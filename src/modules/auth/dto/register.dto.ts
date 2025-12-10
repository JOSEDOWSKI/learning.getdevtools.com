import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Matches(/^\d{8}$/, { message: 'DNI debe tener 8 dígitos' })
  dni: string;

  @IsString()
  @MinLength(3)
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  invite_code?: string;

  @IsOptional()
  @IsString()
  linkedin_url?: string;

  @IsOptional()
  @IsString()
  github_url?: string;

  @IsOptional()
  @IsString()
  portfolio_url?: string;
}

