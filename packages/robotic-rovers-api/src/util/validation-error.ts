export class BusinessValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessValidationError';

    Error.captureStackTrace(this, this.constructor);
  }
}
