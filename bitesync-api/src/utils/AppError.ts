export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; 
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
