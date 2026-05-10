import type { User } from '../entities/user.entity';

export interface UsersRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Pick<User, 'email' | 'password'>): Promise<User>;
}
