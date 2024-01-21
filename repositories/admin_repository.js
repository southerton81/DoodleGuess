var User = require('../models/user.js')
var Score = require('../models/score.js')
var Drawing = require('../models/drawing.js')
var History = require('../models/history.js')
var GuessResult = require('../models/guess_result.js')
var GuessDrawing = require('../models/guess_drawing.js')
var DbConnection = require('../db/db_connection.js')
var mysql = require('mysql2')
var UserNotFoundError = require('../error/errors.js').UserNotFoundError
var DatabaseError = require('../error/errors.js').DatabaseError
 
class AdminRepository {

    getNonValidDrawing() {
        return DbConnection.runQuery(this._selectNonValidDrawing())
            .then(rows => {
                if (rows != null && rows.length > 0) {
                    let drawingId = rows[0].DrawingId
                    let data = rows[0].Data
                    let word = rows[0].Word
                    let userName = rows[0].Name
                    return Promise.resolve(new GuessDrawing(drawingId, word, data, userName))
                }
                return Promise.reject(
                    new DatabaseError(
                        'getNonValidDrawing: Non valid drawings not found'
                    )
                )
            })
    }

    setDrawingValidity(drawingId, validity) {
        return DbConnection.runQuery(this._updateDrawingValidity(drawingId, validity))
            .then(result => {
                return Promise.resolve(result.changedRows == 1)
            })
            .catch(err => {
                return Promise.reject(err)
            })
    }

    _selectNonValidDrawing() {
        return (
            'SELECT drawings.UserId, DrawingId, Data, Word, user.Name FROM drawings ' +
            'JOIN user ON user.UserId = drawings.UserId ' +
            'WHERE drawings.Valid = 0 LIMIT 1'
        )
    }

    _updateDrawingValidity(drawingId, validity) {
        return (
            'UPDATE drawings SET drawings.Valid = ' +
            validity +
            ' WHERE drawings.DrawingId = ' +
            drawingId  
        )
    }
}


module.exports = AdminRepository