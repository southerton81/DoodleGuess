var util = require('util');

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);
    this.message = message;
}
util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';

function HttpError(status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);
    this.status = status;
    this.message = message;
}
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

function DatabaseError(status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, DatabaseError);
    this.status = status;
    this.message = message;
}
util.inherits(DatabaseError, Error);
DatabaseError.prototype.name = 'DatabaseError';

function UserNotFoundError(status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, UserNotFoundError);
    this.status = status;
    this.message = message;
}
util.inherits(UserNotFoundError, Error);
UserNotFoundError.prototype.name = 'UserNotFoundError';


exports.HttpError = HttpError;
exports.AuthError = AuthError;
exports.DatabaseError = DatabaseError;
exports.UserNotFoundError = UserNotFoundError;
