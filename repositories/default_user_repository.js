var User = require('./../models/user.js')
var Score = require('./../models/score.js')
var DbConnection = require('./../db/db_connection.js')
var mysql = require('mysql') 
var UserNotFoundError = require('./../error/errors.js').UserNotFoundError

class DefaultUserRepository {
    findUser(userName) {
        return new Promise((resolve, reject) => {
            var query = 'SELECT * FROM USER WHERE Name = ' + mysql.escape(userName)
            DbConnection.runQuery(query)
                .then(rows => {
                    if (rows != null && rows.length > 0) {
                        let name = rows[0].Name
                        let userId = rows[0].UserId
                        return resolve(new User(name, null, userId))
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
            var query = 'SELECT * FROM SCORES WHERE SCORES.UserId = ' + mysql.escape(userId) + ' LIMIT 1'
            DbConnection.runQuery(query)
                .then(rows => {
                    if (rows != null && rows.length > 0) {
                        let listenScore = rows[0].ListenScore || 0
                        let speakScore = rows[0].SpeakScore || 0
                        return resolve(new Score(listenScore + speakScore))
                    }

                    return resolve(new Score(0))
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }
}

module.exports = DefaultUserRepository
