// Converts thrown application errors into a consistent JSON response shape.
const errorMiddleware = async (err, req, res, next) => {
  // Fall back to HTTP 500 when an error does not provide an explicit status code.
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    message: message,
    success: false,
  });
};

module.exports = errorMiddleware;
