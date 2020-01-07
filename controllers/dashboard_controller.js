var User = require('./../models/user.js')
var DbConnection = require('./../db/db_connection.js')
var mysql = require('mysql')
var Promise = require('promise')
var DatabaseError = require('./../error/errors.js').DatabaseError
var SpeakTurnGenerator = require('./../utils/speak_turn_generator.js')
var TurnId = require('./../utils/turn_id.js')
var DefaultUserRepository = require('./../repositories/default_user_repository.js')

function createTurnId(userName) {
    var userIdQuery =
        'SELECT UserId FROM USER WHERE Name = ' + mysql.escape(userName)

    let turnId = TurnId.SPEAK
    let userId
    return DbConnection.runQuery(userIdQuery)
        .then(rows => {
            if (rows.length == 0) {
                return Promise.reject(new DatabaseError(0, 'User id not found'))
            }

            userId = rows[0].UserId
            return 'INSERT INTO TURN VALUES (' + turnId + ', ' + userId + ')'
        })
        .then(query => {
            return DbConnection.runQuery(query)
        })
        .then(rows => {
            return { turnId, userId }
        })
}

function getTurnIdFromRow(row) {
    let turnId = row.Turn
    let userId = row.UserId
    return { turnId, userId }
}

DashboardController = {}

DashboardController.userRepository = function() {
    return new DefaultUserRepository()
}

DashboardController.getScore = function(req, res, next) {
    if (!req.user.Id) {
        res.status(401)
        res.end()
    } else {
        DashboardController.userRepository()
            .getUserScore(req.userId)
            .then(score => {
                res.status(200)
                res.json(score) 
                res.end()
            })
            .catch(err => {
                return next(err)
            })
    }
}

module.exports = DashboardController
