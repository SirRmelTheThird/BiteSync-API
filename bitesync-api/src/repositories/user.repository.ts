import type { User } from '@prisma/client';
import { prisma } from '../prisma/client';

export type CreateUserData = {
  email: string;
  password: string; // already-hashed, never plaintext past the service layer
};

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
}

export class PrismaUserRepository implements IUserRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  }
}
