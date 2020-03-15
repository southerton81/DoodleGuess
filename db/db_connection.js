var mysql = require('mysql');
var DatabaseError = require('./../error/errors.js').DatabaseError;
var fs = require('fs');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: fs.readFileSync('./usr').toString(),
    password: fs.readFileSync('./pwd').toString(),
    database: fs.readFileSync('./dbs').toString(),
    debug: false
});

DbConnection = {}

DbConnection.runQuery = function(...args) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                return reject(err);
            }

            connection.on('error', function (err) {
                console.log(err)
                return reject(err);
            });

            connection.query(...args, function (err, rows) {
                connection.release();
                if (!err) {
                    return resolve(rows);
                } else {
                    return reject(err);
                }
            });
        });
    })
}

module.exports = DbConnection;
