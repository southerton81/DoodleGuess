var User = require("./../models/user.js");
var DbConnection = require("./../db/db_connection.js");
var mysql = require('mysql');
var async = require('async');
var HttpError = require('./../error/errors.js').HttpError;
var AuthError = require('./../error/errors.js').AuthError;

UserController = {};

UserController.create = function (userName, userPassword, next) {
    var user = new User(userName, userPassword);
    var query = 'INSERT INTO USER SET ' + mysql.escape(user);

    DbConnection.runQueryWithCb(query, function (err, rows) {
        next(err, userName);
    });
}

UserController.findOneWithPassword = function (userName, userPassword, next) {
    var query = 'SELECT * FROM USER WHERE Name = ' + mysql.escape(userName);

    DbConnection.runQueryWithCb(query, function (err, rows) {
        if (rows != null && rows.length > 0) {
            var dbPassword = rows[0].Password;
            if (dbPassword != null && dbPassword != undefined) {
                if (userPassword === dbPassword) {
                    return next(err, new User(userName, userPassword));
                }
                return next(new AuthError('Wrong password'));
            }
        }
        return next(err, null);
    });
}

UserController.findOne = function (userName, next) {
    var query = 'SELECT * FROM USER WHERE Name = ' + mysql.escape(userName);

    DbConnection.runQueryWithCb(query, function (err, rows) {
        if (rows != null && rows.length > 0) {
            next(err, new User(userName, ''));
        }
        next(new AuthError('No such user'));
    });
}

UserController.login = function (req, res, next) {
    var name = req.body.name;
    var password = req.body.password;

    async.waterfall([
        function (callback) {
            UserController.findOneWithPassword(name, password, callback);
        },
        function (user, callback) {
            if (user) {
                res.status(200)
                callback(null, user);
            } else {
                UserController.create(name, password, function (err, user) {
                    if (err) return callback(err);
                    res.status(201)
                    callback(null, user);
                });
            }
        }
    ], function (err, user) {
        if (err) {
            if (err instanceof AuthError)
                return next(new HttpError(403, err.message));
            return next(err);
        }

        req.session.userName = name;
        res.setHeader('userName', name);
        res.end();
    });
}

UserController.logout = function (req, res, next) {
    if (req.session)
        req.session.destroy();
    res.status(200);
    res.end();
}

module.exports = UserController;