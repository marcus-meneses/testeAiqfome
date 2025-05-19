import { Logger } from "./Logger";

const logger = Logger.Instance;
class CustomError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    logger.error("ERROR " + statusCode + ": " + message + " - " + details);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
  }
}

class DatabaseConnectionError extends CustomError {
  constructor(message = "Database connection Error", details?: any) {
    super(message, 500, details);
  }
}

class DatabaseQueryError extends CustomError {
  constructor(message = "Database query Error", details?: any) {
    super(message, 500, details);
  }
}

class BadRequestError extends CustomError {
  constructor(message = "Bad Request", details?: any) {
    super(message, 400, details);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Not Found", details?: any) {
    super(message, 404, details);
  }
}

class NetworkError extends CustomError {
  constructor(message = "Network Error", details?: any) {
    super(message, 503, details);
  }
}

class InternalServerError extends CustomError {
  constructor(message = "Internal Server Error", details?: any) {
    super(message, 500, details);
  }
}

export {
  DatabaseConnectionError,
  DatabaseQueryError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
  NetworkError,
};
