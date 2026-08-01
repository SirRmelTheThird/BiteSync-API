/**
 * A typed, HTTP-aware error. Throwing this anywhere in a service or
 * controller lets the central error handler (middleware/errorHandler.ts)
 * turn it into the right status code and JSON shape automatically —
 * no repeated try/catch or res.status(...) calls scattered around.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes "expected" errors from bugs
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  static badRequest(message = 'Invalid request') {
    return new AppError(message, 400);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  static conflict(message = 'Resource already exists') {
    return new AppError(message, 409);
  }
}
