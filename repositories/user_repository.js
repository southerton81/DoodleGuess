var User = require('../models/user.js')
var Score = require('../models/score.js')
var Drawing = require('../models/drawing.js')
var History = require('../models/history.js')
var GuessResult = require('../models/guess_result.js')
var DbConnection = require('../db/db_connection.js')
var mysql = require('mysql2')
var UserNotFoundError = require('../error/errors.js').UserNotFoundError
var DatabaseError = require('../error/errors.js').DatabaseError

/**
 * May be divided into UserRepository, ScoreRepository
 */
class UserRepository { 

    findUser(userName) {
        return new Promise((resolve, reject) => {
            var query =
                'SELECT * FROM USER WHERE Name = ' + mysql.escape(userName)
            DbConnection.runQuery(query)
                .then(rows => {
                    if (rows != null && rows.length > 0) {
                        let userId = rows[0].UserId
                        let name = rows[0].Name
                        return resolve(new User(userId, name, null))
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
                'SELECT USER.Name, SCORES.GuessScore, SCORES.DrawScore ' +
                'FROM USER LEFT JOIN SCORES ON USER.UserId = SCORES.UserId ' +
                'WHERE USER.UserId = ' +
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
                'SELECT USER.Name, ifnull(SCORES.GuessScore, 0) + ifnull(SCORES.DrawScore, 0) as TotalScore ' +
                'FROM USER LEFT JOIN SCORES ON USER.UserId = SCORES.UserId ORDER BY TotalScore DESC'
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
                'DELETE FROM USER WHERE UserId = ' + mysql.escape(userId)
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
