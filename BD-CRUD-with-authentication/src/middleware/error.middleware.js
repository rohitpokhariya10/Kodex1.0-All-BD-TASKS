const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode;
  let message = err.message;
  return res.status(statusCode).json({
    message: message,
    success:false,
  });
};
module.exports = errorMiddleware;
