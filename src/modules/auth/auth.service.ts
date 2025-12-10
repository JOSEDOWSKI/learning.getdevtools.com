import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        console.log(`User not found: ${email}`);
        return null;
      }
      if (!user.password) {
        console.error('User found but password is missing');
        return null;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`Password validation for ${email}: ${isPasswordValid}`);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      console.log(`Invalid password for ${email}`);
      return null;
    } catch (error) {
      console.error('Error validating user:', error);
      return null; // Retornar null en lugar de lanzar error para evitar 500
    }
  }

  async login(user: any) {
    try {
      if (!user || !user.email || !user.id) {
        throw new Error('Invalid user object');
      }
      const payload = { email: user.email, sub: user.id, role: user.role };
      const access_token = this.jwtService.sign(payload);
      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  async register(registerDto: {
    dni: string;
    full_name: string;
    email: string;
    password: string;
    role?: string;
    invite_code?: string;
  }) {
    // Verificar si el registro público está habilitado
    const allowPublicRegister = this.configService.get<string>('ALLOW_PUBLIC_REGISTER', 'true') === 'true';
    if (!allowPublicRegister) {
      throw new UnauthorizedException('El registro público está deshabilitado temporalmente');
    }

    // Validación básica de DNI (8 dígitos)
    if (!/^\d{8}$/.test(registerDto.dni)) {
      throw new UnauthorizedException('DNI inválido. Debe tener 8 dígitos.');
    }

    // Determinar rol permitido (solo alumno o profesor)
    const requestedRole =
      registerDto.role === UserRole.PROFESOR ? UserRole.PROFESOR : UserRole.ALUMNO;

    // Bloquear cualquier intento de crear super_admin por registro
    if (registerDto.role === UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('No autorizado');
    }

    // Si es profesor, validar invite_code (si está configurado en env)
    if (requestedRole === UserRole.PROFESOR) {
      const requiredCode = this.configService.get<string>('INVITE_CODE_PROFESOR');
      if (requiredCode && registerDto.invite_code !== requiredCode) {
        throw new BadRequestException('Código de invitación inválido');
      }
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: requestedRole,
    });

    return this.login(user);
  }
}

