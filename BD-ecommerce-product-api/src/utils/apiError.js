// Application-specific error type carrying an HTTP status for centralized handling.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.sucess = false;

    // Preserve the original call site in stack traces for easier debugging.
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ApiError;
