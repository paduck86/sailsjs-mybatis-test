module.exports = function CustomError(status, code, msg) {
    Error.captureStackTrace(this, this.constructor);
    this.status = status;
    this.code = code;
    this.msg = msg;
};

require('util').inherits(module.exports, Error);