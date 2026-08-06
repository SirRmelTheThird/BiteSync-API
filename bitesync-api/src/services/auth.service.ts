import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import type { IUserRepository } from '../repositories/user.repository';

const SALT_ROUNDS = 12;

export type AuthResult = {
  token: string;
  user: { id: string; email: string };
};

export type TokenIssuer = (userId: string) => string;
export class AuthService {
  constructor(
    private readonly users: IUserRepository,
    private readonly issueToken: TokenIssuer
  ) {}

  async register(email: string, password: string): Promise<AuthResult> {
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw AppError.conflict('An account with that email already exists');
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.users.create({ email, password: hashed });

    return { token: this.issueToken(user.id), user: { id: user.id, email: user.email } };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.users.findByEmail(email);

    // Deliberately identical error for "no such user" and "wrong password"
    // — distinguishing them lets an attacker enumerate valid emails.
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      throw AppError.unauthorized('Invalid email or password');
    }

    return { token: this.issueToken(user.id), user: { id: user.id, email: user.email } };
  }
}

/** Default token issuer used in production: real JWT signed with env secret. */
export function createJwtIssuer(secret: string, expiresIn: string): TokenIssuer {
  return (userId: string) =>
    jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
}
