var mysql = require('mysql2');
var DatabaseError = require('./../error/errors.js').DatabaseError;
var fs = require('fs');

let host = fs.readFileSync('./config/host').toString() 
let user = fs.readFileSync('./config/usr').toString()
let password = fs.readFileSync('./config/pwd').toString()
let database = fs.readFileSync('./config/dbs').toString()

var pool = mysql.createPool({
    connectionLimit: 100,
    host: host,
    user: user,
    password: password,
    database: database,
    debug: false,
    port: 3306,
})


DbConnection = {}

DbConnection.runQuery = function (args) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                return reject(err)
            }

            connection.on('error', function (err) {
                console.log(err)
                return reject(err)
            })

            connection.query(args, function (err, rows) {
                connection.release()
                if (!err) {
                    return resolve(rows)
                } else {
                    return reject(err)
                }
            })
        })
    })
}

DbConnection.runQueriesInTransaction = function (...args) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                return reject(err)
            }

            connection.on('error', function (err) {
                console.log(err)
                return reject(err)
            });

            connection.beginTransaction(function (err) {
                if (err) {
                    connection.release()
                    return reject(err)
                }

                let queriesCount = args.length - 1
                let currentQueryIndex = 0

                function execNextQuery(currentQueryIndex, queriesCount) {
                    connection.query(args[currentQueryIndex], function (err, rows) {
                        if (!err && currentQueryIndex == queriesCount) {
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        connection.release()
                                        return reject(err)
                                    })
                                }
                                connection.release()
                                return resolve(rows)
                            })
                        } else if (err) {
                            return connection.rollback(function () {
                                connection.release()
                                return reject(err)
                            })
                        } else {
                            execNextQuery(++currentQueryIndex, queriesCount)
                        }
                    })
                }

                if (currentQueryIndex <= queriesCount) {
                    execNextQuery(currentQueryIndex, queriesCount)
                } else {
                    return reject(new Error("Empty queries array passed to runQueriesInTransaction() function"))
                }
            })
        })
    })
}


module.exports = DbConnection
