var User = require("./../models/user.js");
var DbConnection = require("./../db/db_connection.js");
var mysql = require('mysql');
var async = require('async');
var Promise = require('promise');
var DatabaseError = require('./../error/errors.js').DatabaseError;
var SpeakTurnGenerator = require('./../utils/speak_turn_generator.js');

function createTurnId(userName, next) {
    var userIdQuery = 'SELECT UserId FROM USER WHERE Name = ' + mysql.escape(userName);

    let turnId = 0;
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

function saveSpeakTurn(userId, imageLinks) {
    let images = JSON.stringify(imageLinks.additionalImages);
    let insertNewSpeakTurnQuery = 'REPLACE INTO INTERIM_SPEAKTURN VALUES (' + userId + ', \'' +
        imageLinks.selectedImage + '\', ' + '\'' + images + '\', null);';
    return DbConnection.runQuery(insertNewSpeakTurnQuery);
}

function createSpeakTurn(userId) {
    let selectedImage;
    return SpeakTurnGenerator.generateSpeakTurn()
        .then(imageLinks => {
            selectedImage = imageLinks.selectedImage;
            return saveSpeakTurn(userId, imageLinks);
        })
        .then(rows => {
            return { turn: "speak", image: selectedImage}
        });
}

DashboardController = {}

DashboardController.getState = function (req, res, next) {
    if (!req.user) {
        res.status(403);
        res.end();
    } else {
        let userName = req.user.Name;
        res.setHeader('userName', userName);

        let turnQuery = 'SELECT Turn, USER.UserId FROM USER, TURN WHERE Name = ' + mysql.escape(userName)
            + ' AND TURN.UserId = USER.UserId';

        DbConnection.runQuery(turnQuery)
            .then(rows => {
                if (rows.length == 0) {
                    return createTurnId(userName, next);
                }
                let turn = rows[0].Turn;
                let userId = rows[0].UserId;
                return { turn, userId }
            })
            .then(userTurn => {
                return createSpeakTurn(userTurn.userId);
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