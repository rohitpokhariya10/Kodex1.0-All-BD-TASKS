Error.captureStackTrace(this, this.constructor) adds a clean stack trace to the current ApiError object.

this.constructor hides the unnecessary ApiError constructor line, so the stack directly shows where you wrote throw new ApiError(...)