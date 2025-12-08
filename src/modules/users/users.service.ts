import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // Hashear la contraseña si se proporciona y no está ya hasheada
    let hashedPassword = userData.password;
    if (userData.password && !userData.password.startsWith('$2b$')) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: (userData.role as UserRole) || UserRole.ALUMNO,
    });
    const savedUser = await this.userRepository.save(user);

    // Crear wallet automáticamente
    const wallet = this.walletRepository.create({
      user_id: savedUser.id,
      balance: 0,
    });
    await this.walletRepository.save(wallet);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'dni', 'full_name', 'email', 'role', 'created_at'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'dni', 'full_name', 'email', 'role', 'created_at'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByDni(dni: string): Promise<User> {
    return this.userRepository.findOne({ where: { dni } });
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
}

