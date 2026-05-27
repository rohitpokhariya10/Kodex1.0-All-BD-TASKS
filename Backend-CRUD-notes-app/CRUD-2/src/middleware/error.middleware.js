const errorMiddleware = (err , req , res , next)=>{
    let statusCode = err.statuscode || 500;
    let message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        message:message,
        success:false,
    })
}
module.exports = errorMiddleware;