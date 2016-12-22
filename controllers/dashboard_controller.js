var User = require("./../models/user.js");
var DbConnection = require("./../db/db_connection.js");
var mysql = require('mysql');
var async = require('async');
var Promise = require('promise');
var DatabaseError = require('./../error/errors.js').DatabaseError;

function createTurn(userName, next) {
    var userIdQuery = 'SELECT UserId FROM USER WHERE Name = ' + mysql.escape(userName);

    return DbConnection.runQuery(userIdQuery)
        .then(rows => {
            if (rows.length == 0) {
                return Promise.reject(new DatabaseError(0, 'User id not found'));
            }

            var userId = rows[0].UserId;
            var insertTurnQuery = 'INSERT INTO TURN VALUES (0,' + userId + ')';
            return DbConnection.runQuery(insertTurnQuery);
        });
}

DashboardController = {}

DashboardController.getState = function (req, res, next) {
    if (!req.user) {
        res.status(403);
        res.end();
        return;
    } else {
        var userName = req.user.Name;
        res.setHeader('userName', userName);

        var turnQuery = 'SELECT Turn FROM USER, TURN WHERE Name = '
            + mysql.escape(userName)
            + ' AND TURN.UserId = USER.UserId';

        DbConnection.runQuery(turnQuery)
            .then(rows => {
                if (rows.length == 0) {
                    return createTurn(userName, next);
                }
                return rows;
            })
            .then(rows => {
                res.status(200);
                res.end();
            })
            .catch(error => {
                return next(error);
            });
    }
}


module.exports = DashboardController;