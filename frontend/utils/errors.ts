// Custom error classes for consistent HTTP error handling in the frontend

export class RequestError extends Error {
  statusCode: number;
  details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.name = "RequestError";
    this.statusCode = 400;
    this.details = details;
    Object.setPrototypeOf(this, RequestError.prototype);
  }
}

export class ValidationError extends Error {
  statusCode: number;
  details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 422;
    this.details = details;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.details = details;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
    this.details = details;
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
