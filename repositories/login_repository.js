var pwdhashing = require('../utils/pwd_hashing.js')
var User = require('../models/user.js')
var DbConnection = require('../db/db_connection.js')
var mysql = require('mysql')
var AuthError = require('../error/errors.js').AuthError
var UserNotFoundError = require('../error/errors.js').UserNotFoundError

class LoginRepository {
    login(userName, userPassword) {
        return new Promise((resolve, reject) => {
            var query =
                'SELECT * FROM USER WHERE Name = ' + mysql.escape(userName)
            DbConnection.runQuery(query)
                .then(rows => {
                    if (rows != null && rows.length > 0) {
                        var storedPassword = rows[0].Password
                        if (
                            storedPassword != null &&
                            storedPassword != undefined
                        ) {
                            let hashedUserPassword = pwdhashing(userPassword)
                            if (hashedUserPassword === storedPassword) {
                                return resolve(new User(null, userName, userPassword))
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

    register(userName, userPassword) {
        let hashedPassword = pwdhashing(userPassword)
        var user = new User(null, userName, hashedPassword)
        var query = 'INSERT INTO USER SET ' + mysql.escape(user)
        return DbConnection.runQuery(query)
    }
}

module.exports = LoginRepository
