// Custom error class for API responses.
class ApiError extends Error{
    constructor(statusCode , message){
        super(message);

        // Store HTTP status and success flag for the error middleware.
        this.statusCode = statusCode;
        this.success = false;


        Error.captureStackTrace(this , this.constructor);
    }
}
module.exports = ApiError;
