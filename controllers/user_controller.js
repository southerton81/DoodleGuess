var HttpError = require('./../error/errors.js').HttpError
var AuthError = require('./../error/errors.js').AuthError
var UserNotFoundError = require('./../error/errors.js').UserNotFoundError
var LoginRepository = require('./../repositories/login_repository.js')
var UserRepository = require('./../repositories/user_repository.js')

/**
 * Login, logout, find user
 */
UserController = {}

UserController.loginRepository = function() {
    return new LoginRepository()
}

UserController.userRepository = function() {
    return new UserRepository()
}

UserController.findUser = function(userName, next) {
    UserController.userRepository()
        .findUser(userName)
        .then(user => {
            return next(null, user)
        })
        .catch(err => {
            return next(err)
        })
}

UserController.login = function(req, res, next) {
    var name = req.body.name
    var password = req.cookies.guessDrawCookie

    UserController.loginRepository()
        .login(name, password)
        .then(user => {
            res.status(200)
            req.session.userName = name
            res.end()
        })
        .catch(err => {
            if (err instanceof UserNotFoundError) {
                return UserController.loginRepository()
                    .register(name, password)
                    .then(user => {
                        res.status(201)
                        req.session.userName = name
                        res.end()
                    })
                    .catch(err => {
                        return next(err)
                    })
            } else {
                if (err instanceof AuthError) {
                    return next(new HttpError(401, err.message))
                } else {
                    return next(err)
                }
            }
        })
}

UserController.logout = function(req, res, next) {
    if (req.session) {
        req.session.destroy()
    }

    res.status(200)
    res.end()
}

UserController.deleteUser = function (req, res, next) {
    UserController.userRepository()
        .deleteUser(req.user.UserId)
        .then(user => {
            if (req.session) {
                req.session.destroy()
            }

            res.status(204)
            res.end()
        })
        .catch(err => {
            return next(err)
        })
}

module.exports = UserController
