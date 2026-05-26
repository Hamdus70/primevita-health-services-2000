export class AppError extends Error {
  code: string;
  statusCode: number;
  details?: any;
  exposeMessage: boolean;

  constructor(message: string, code: string, statusCode: number, details?: any, exposeMessage: boolean = true) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.exposeMessage = exposeMessage;
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", details?: any) {
    super(message, "VALIDATION_ERROR", 400, details, true);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, "UNAUTHENTICATED", 401, undefined, true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, "FORBIDDEN", 403, undefined, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, "NOT_FOUND", 404, undefined, true);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, "CONFLICT", 409, undefined, true);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, "RATE_LIMITED", 429, undefined, true);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(message, "INTERNAL_ERROR", 500, undefined, false);
  }
}
