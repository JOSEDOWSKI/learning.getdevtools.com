import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return null;
      }
      if (!user.password) {
        console.error('User found but password is missing');
        return null;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error validating user:', error);
      throw error;
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
  }) {
    // Validación básica de DNI (8 dígitos)
    if (!/^\d{8}$/.test(registerDto.dni)) {
      throw new UnauthorizedException('DNI inválido. Debe tener 8 dígitos.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: registerDto.role ? (registerDto.role as UserRole) : UserRole.ALUMNO,
    });

    return this.login(user);
  }
}

