var User = require("./../models/user.js");
var DbConnection = require("./../db/db_connection.js");
var mysql = require('mysql');
var Promise = require('promise');
var DatabaseError = require('./../error/errors.js').DatabaseError;
var SpeakTurnGenerator = require('./../utils/speak_turn_generator.js');
var TurnId = require('./../utils/turn_id.js');

function createTurnId(userName) {
    var userIdQuery = 'SELECT UserId FROM USER WHERE Name = ' + mysql.escape(userName);

    let turnId = TurnId.SPEAK;
    let userId;
    return DbConnection.runQuery(userIdQuery)
        .then(rows => {
            if (rows.length == 0) {
                return Promise.reject(new DatabaseError(0, 'User id not found'));
            }

            userId = rows[0].UserId;
            return 'INSERT INTO TURN VALUES (' + turnId + ', ' + userId + ')';
        })
        .then(query => {
            return DbConnection.runQuery(query);
        })
        .then(rows => {
            return { turnId, userId };
        });
}

function getTurnIdFromRow(row) {
    let turnId = row.Turn;
    let userId = row.UserId;
    return { turnId, userId }
}

DashboardController = {}

DashboardController.getState = function (req, res, next) {
    if (!req.user) {
        res.status(403);
        res.end();
    } else {
        let userName = req.user.Name;
        res.setHeader('userName', userName);

        let turnQuery = 'SELECT Turn, USER.UserId FROM USER, TURN WHERE Name = '
            + mysql.escape(userName)
            + ' AND TURN.UserId = USER.UserId';

        DbConnection.runQuery(turnQuery)
            .then(rows => {
                if (rows.length == 0) {
                    return createTurnId(userName);
                }
                return getTurnIdFromRow(rows[0]);
            })
            .then(userTurn => {
                if (userTurn.turnId == TurnId.SPEAK) {
                    return SpeakTurnGenerator.getSpeakTurn(userTurn.userId);
                }
            })
            .then(jsonResponse => {
                res.status(200).json(jsonResponse).end();
            })
            .catch(error => {
                return next(error);
            });
    }
}

module.exports = DashboardController;