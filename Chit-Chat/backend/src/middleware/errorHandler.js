import { ZodError } from 'zod';

export function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed.',
      details: error.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  const statusCode = error.statusCode ?? 500;
  const message = statusCode === 500 ? 'Internal server error.' : error.message;

  res.status(statusCode).json({ message });
}
