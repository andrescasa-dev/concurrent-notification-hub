import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '../constants/injection-tokens';
import type { UsersRepository } from '../repositories/users.repository.interface';
import type { User } from '../entities/user.entity';
import type { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  getByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  getById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }
    return this.usersRepository.create({
      email: dto.email,
      password: dto.password,
    });
  }
}
