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

DbConnection = {};

DbConnection.runQueryWithCb = function (query, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.on('error', function (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        });

        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                next.apply(this, [err, rows]);
            } else console.log(err);
        });

    });
}

DbConnection.runQuery = function(query) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return reject(new DatabaseError(100, 'Error in connection database'));
            }

            console.log('connected as id ' + connection.threadId);

            connection.on('error', function (err) {
                return reject(new DatabaseError(100, 'Error in connection database'));
            });

            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    return resolve(rows);
                } else {
                    return reject(new DatabaseError(100, 'Error in connection database'));
                }
            });
        });
    })
}


module.exports = DbConnection;
