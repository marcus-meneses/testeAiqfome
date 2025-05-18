import { Logger } from "./Logger";

export class CustomError extends Error {
    statusCode: number;
    details?: any;
  
    constructor(message: string, statusCode: number, details?: any) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.details = details;
      // Maintains proper stack trace for where our error was thrown (available on V8 engines only)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error().stack;
      }
    }
  }

  class DatabaseError extends CustomError {
      constructor(message = "Database Error", details?: any) {
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
  
  class InternalServerError extends CustomError {
      constructor(message = "Internal Server Error", details?: any) {
          super(message, 500, details);
      }
  }
  
  // Usage example:
  function processData(data: any) {
    if (!data) {
      throw new BadRequestError("Data is required", { missingField: 'data' });
    }
    if (typeof data !== 'object') {
        throw new TypeError("Data must be an object");
    }
    if (!data.id) {
      throw new NotFoundError(`Data with id ${data.id} not found`);
    }
  
    if (data.value < 0) {
        throw new CustomError("Value cannot be negative", 400, {actualValue: data.value});
    }
    return { message: "Data processed successfully", data };
  }
  
  // Example of handling the errors
  try {
      const result = processData({ id: 1, value: -5 });
      console.log(result);
  } catch (error) {
      if (error instanceof CustomError) {
          console.error(`Error: ${error.message}, Status Code: ${error.statusCode}`, error.details ? `, Details: ${JSON.stringify(error.details)}` : "");
      } else {
          console.error("An unexpected error occurred:", error);
      }
  }