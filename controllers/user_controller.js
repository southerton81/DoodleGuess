var User = require('./../models/user.js')
var DbConnection = require('./../db/db_connection.js')
var mysql = require('mysql')
var async = require('async')
var pwdhashing = require('./../utils/pwd_hashing.js')
var HttpError = require('./../error/errors.js').HttpError
var AuthError = require('./../error/errors.js').AuthError
var UserNotFoundError = require('./../error/errors.js').UserNotFoundError
var LoginRepository = require('./../repositories/login_repository.js')
var UserRepository = require('./../repositories/user_repository.js')

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
    var password = req.body.password

    UserController.loginRepository()
        .login(name, password)
        .then(user => {
            res.status(200)
            req.session.userName = name
            res.setHeader('userName', name)
            res.end()
        })
        .catch(err => {
            if (err instanceof UserNotFoundError) {
                return UserController.loginRepository()
                    .register(name, password)
                    .then(user => {
                        res.status(201)
                        req.session.userName = name
                        res.setHeader('userName', name)
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

module.exports = UserController
