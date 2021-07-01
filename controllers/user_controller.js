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

UserController.findUser = function(userName, password, next) {
    UserController.userRepository()
        .findUser(userName, password)
        .then(user => {
            return next(null, user)
        })
        .catch(err => {
            return next(err)
        })
}

UserController.login = function(req, res, next) { 
    let name = req.header('x-user-name')
    let password = req.header('x-auth-token')

    if (!password) {
        password = makeid(64)
    }

    UserController.loginRepository()
        .login(name, password)
        .then(user => {
            res.status(200)
            res.end()
        })
        .catch(err => {
            if (err instanceof UserNotFoundError) {
                return UserController.loginRepository()
                    .register(name, password)
                    .then(user => {
                        req.user = user
                        res.json({ token: password })
                        res.status(201)
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
    res.status(200)
    res.end()
}

UserController.deleteUser = function (req, res, next) {
    UserController.userRepository()
        .deleteUser(req.user.UserId)
        .then(user => {
            res.status(204)
            res.end()
        })
        .catch(err => {
            return next(err)
        })
}

function makeid(length) {
    var result           = '';
    var characters       = '~zAB@DEFG#Iefgh^jklmn%pqr$tuvw(yz012)45-7=+JKLM!OPQ&STUV*XYZabcd';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = UserController
