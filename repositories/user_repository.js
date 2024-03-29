var User = require('../models/user.js')
var Score = require('../models/score.js')
var Drawing = require('../models/drawing.js')
var History = require('../models/history.js')
var GuessResult = require('../models/guess_result.js')
var DbConnection = require('../db/db_connection.js')
var pwdhashing = require('../utils/pwd_hashing.js')
var mysql = require('mysql2')
var UserNotFoundError = require('../error/errors.js').UserNotFoundError
var DatabaseError = require('../error/errors.js').DatabaseError

/**
 * May be divided into UserRepository, ScoreRepository
 */
class UserRepository { 

    findUser(userName, password) {
        return new Promise((resolve, reject) => {
            var query =
                'SELECT * FROM user WHERE Name = ' + mysql.escape(userName)
            DbConnection.runQuery(query)
                .then(rows => {
                    if (rows != null && rows.length > 0) {
                        let userId = rows[0].UserId
                        let userName = rows[0].Name
                        var storedPassword = rows[0].Password

                        if (storedPassword != null && storedPassword != undefined) {
                            let hashedUserPassword = pwdhashing(password)
                            if (hashedUserPassword === storedPassword) {
                                return resolve(new User(userId, userName))
                            }
                            return reject(new AuthError('Wrong password'))
                        }
                    }

                    return reject(new UserNotFoundError())
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }

    getUserScore(userId) {
        return new Promise((resolve, reject) => {
            var query =
                'SELECT user.Name, scores.GuessScore, scores.DrawScore ' +
                'FROM user LEFT JOIN scores ON user.UserId = scores.UserId ' +
                'WHERE user.UserId = ' +
                mysql.escape(userId) +
                ' LIMIT 1'
            DbConnection.runQuery(query)
                .then(rows => {
                    if (rows != null && rows.length > 0) {
                        let userName = rows[0].Name || ''
                        let guessScore = rows[0].GuessScore || 0
                        let drawScore = rows[0].DrawScore || 0
                        return resolve(
                            new Score(userName, guessScore, drawScore)
                        )
                    }

                    return resolve(new Score('', 0, 0))
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }

    getHighscores() {
        return new Promise((resolve, reject) => {
            var query =
                'SELECT user.Name, ifnull(scores.GuessScore, 0) + ifnull(scores.DrawScore, 0) as TotalScore ' +
                'FROM user LEFT JOIN scores ON user.UserId = scores.UserId ORDER BY TotalScore DESC'
            DbConnection.runQuery(query)
                .then(rows => {
                    let scores = []
                    if (rows != null) {
                        scores = rows.map(row => {
                            let userName = row.Name || ''
                            let guessScore = row.TotalScore || 0
                            let drawScore = 0
                            return new Score(userName, guessScore, drawScore)
                        })
                    }

                    return resolve(scores)
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }

    deleteUser(userId) {
        return new Promise((resolve, reject) => {
            var query =
                'DELETE FROM user WHERE UserId = ' + mysql.escape(userId)
            DbConnection.runQuery(query)
                .then(rows => {
                    return resolve()
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }
}

module.exports = UserRepository
