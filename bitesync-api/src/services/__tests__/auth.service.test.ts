import { describe, expect, it } from 'vitest';
import { AuthService } from '../auth.service';
import { FakeUserRepository } from '../../repositories/__tests__/fakes/FakeUserRepository';
import { AppError } from '../../utils/AppError';

function setup() {
  const users = new FakeUserRepository();
  const issueToken = (userId: string) => `fake-token-for-${userId}`;
  const service = new AuthService(users, issueToken);
  return { users, service };
}

describe('AuthService', () => {
  it('registers a new user and returns a token', async () => {
    const { service } = setup();

    const result = await service.register('armel@example.com', 'password123');

    expect(result.user.email).toBe('armel@example.com');
    expect(result.token).toMatch(/^fake-token-for-/);
  });

  it('never stores the plaintext password', async () => {
    const { users, service } = setup();

    await service.register('armel@example.com', 'password123');
    const stored = await users.findByEmail('armel@example.com');

    expect(stored?.password).not.toBe('password123');
  });

  it('rejects registration with an email that already exists', async () => {
    const { service } = setup();

    await service.register('armel@example.com', 'password123');

    await expect(service.register('armel@example.com', 'different-password')).rejects.toMatchObject({
      statusCode: 409,
    });
  });

  it('logs in with correct credentials', async () => {
    const { service } = setup();
    await service.register('armel@example.com', 'password123');

    const result = await service.login('armel@example.com', 'password123');

    expect(result.user.email).toBe('armel@example.com');
    expect(result.token).toMatch(/^fake-token-for-/);
  });

  it('rejects login with a wrong password', async () => {
    const { service } = setup();
    await service.register('armel@example.com', 'password123');

    await expect(service.login('armel@example.com', 'wrong-password')).rejects.toBeInstanceOf(AppError);
    await expect(service.login('armel@example.com', 'wrong-password')).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('rejects login for an email that was never registered', async () => {
    const { service } = setup();

    await expect(service.login('nobody@example.com', 'password123')).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('gives identical errors for wrong-password and no-such-user, to avoid email enumeration', async () => {
    const { service } = setup();
    await service.register('armel@example.com', 'password123');

    let wrongPasswordMessage: string | undefined;
    let noSuchUserMessage: string | undefined;

    try {
      await service.login('armel@example.com', 'wrong-password');
    } catch (err) {
      wrongPasswordMessage = (err as Error).message;
    }

    try {
      await service.login('nobody@example.com', 'password123');
    } catch (err) {
      noSuchUserMessage = (err as Error).message;
    }

    expect(wrongPasswordMessage).toBe(noSuchUserMessage);
  });
});
