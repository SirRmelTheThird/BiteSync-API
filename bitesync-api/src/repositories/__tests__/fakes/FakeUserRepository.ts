import type { User } from '@prisma/client';
import type { CreateUserData, IUserRepository } from '../../user.repository';

export class FakeUserRepository implements IUserRepository {
  private users: User[] = [];
  private nextId = 1;

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  async create(data: CreateUserData): Promise<User> {
    const user: User = {
      id: String(this.nextId++),
      createdAt: new Date(),
      ...data,
    };
    this.users.push(user);
    return user;
  }
}
