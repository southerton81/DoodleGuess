var User = require('../models/user.js')
var Score = require('../models/score.js')
var Drawing = require('../models/drawing.js')
var History = require('../models/history.js')
var DbConnection = require('../db/db_connection.js')
var mysql = require('mysql')
var UserNotFoundError = require('../error/errors.js').UserNotFoundError
var DatabaseError = require('../error/errors.js').DatabaseError

/**
 * May be devided into UserRepository, DrawingRepository, ScoreRepository
 */
class UserRepository {
    constructor() {
        this.resultDrawingGuessIncorrect = 0
        this.resultDrawingGuessCorrect = 1
        this.resultDrawingSelected = 2
        this.resultDrawingSkipped = 3
    }

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
                'SELECT * FROM SCORES WHERE SCORES.UserId = ' +
                mysql.escape(userId) +
                ' LIMIT 1'
            DbConnection.runQuery(query)
                .then(rows => {
                    if (rows != null && rows.length > 0) {
                        let guessScore = rows[0].GuessScore || 0
                        let drawScore = rows[0].DrawScore || 0
                        return resolve(new Score(guessScore, drawScore))
                    }

                    return resolve(new Score(0, 0))
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }

    createEmptyDrawingWithWord(userId, word) {
        return new Promise((resolve, reject) => {
            let drawing = new Drawing(null, userId, word, null)
            var query = 'INSERT INTO DRAWINGS SET ' + mysql.escape(drawing)

            DbConnection.runQuery(query)
                .then(rows => {
                    let getDrawingIdQuery = 'SELECT * FROM DRAWINGS WHERE DRAWINGS.UserId = ' +
                        mysql.escape(userId) +
                        ' AND DRAWINGS.Word = \'' + word + '\'' +
                        ' AND DRAWINGS.Data IS NULL LIMIT 1'

                    return DbConnection.runQuery(getDrawingIdQuery)
                })
                .then(rows => {
                    let drawingId = rows[0].DrawingId
                    let word = rows[0].Word
                    return resolve(new Drawing(drawingId, null, word, null))
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }

    putUserDrawing(drawingId, data) {
        return new Promise((resolve, reject) => {
            var query = 'UPDATE DRAWINGS SET DRAWINGS.Data = ' + mysql.escape(data) +
                ' WHERE DRAWINGS.DrawingId = ' + drawingId

            DbConnection.runQuery(query)
                .then(rows => {
                    return resolve()
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }

    getRandomDrawing(userId) {
        return this._selectAvailableDrawings(userId)
            .then(rows => {
                if (rows != null && rows.length > 0) {
                    let randomRow = Math.round(Math.random() * (rows.length - 1))
                    let drawingId = rows[randomRow].DrawingId
                    let data = rows[randomRow].Data
                    let word = rows[randomRow].Word
                    return new Drawing(drawingId, null, word, data)
                }
                return Promise.reject(new DatabaseError("getRandomDrawing: No available drawings found"))
            })
            .then(drawing => {
                let history = new History(
                    userId,
                    drawing.DrawingId,
                    this.resultDrawingSelected
                )
                var query =
                    'INSERT IGNORE INTO HISTORY SET ' + mysql.escape(history)
                return DbConnection.runQuery(query).then(rows => {
                    return Promise.resolve(drawing)
                })
            })
            .catch(err => {
                return Promise.reject(err)
            })
    }

    setGuess(userId, drawingId, guessWord) {
        return DbConnection.runQuery(this._getCorrectWordQuery(drawingId))
            .then(rows => {
                let word = rows[0].Word
                let isGuessed = guessWord.toLowerCase().localeCompare(word.toLowerCase()) == 0 ? true : false
                let historyResult = isGuessed ? this.resultDrawingGuessCorrect : this.resultDrawingGuessIncorrect

                if (isGuessed) {
                    return this.incrementScore(userId, drawingId)
                        .then(result => {
                            return DbConnection.runQuery(this._updateHistoryWithResultQuery(historyResult, userId, drawingId))
                        })
                } else {
                    return DbConnection.runQuery(this._updateHistoryWithResultQuery(historyResult, userId, drawingId))
                }
            })
            .then(result => {
                return DbConnection.runQuery(this._getResultFromHistoryQuery(userId, drawingId))
            })
            .then(rows => {
                let result = rows[0].Result
                return Promise.resolve(result)
            })
            .catch(err => {
                return Promise.reject(err)
            })
    }

    incrementScore(userId, drawingId) {
        return DbConnection.runQueriesInTransaction(
            this._insertUserIdToScoresQuery(userId),               // Ensure that UserId's already
            this._insertUserIdByDrawingIdToScoresQuery(drawingId), // exist in a 'Scores' table
            this._incGuessScoreQuery(userId),
            this._incDrawScoreQuery(drawingId))
    }

    _selectAvailableDrawings(userId) {
        let querySelectCurrentDrawing = 'SELECT DrawingId, Data, Word FROM DRAWINGS WHERE ' +
            'DrawingId = (SELECT DrawingId FROM HISTORY WHERE HISTORY.UserId = ' +
            userId +
            ' AND HISTORY.Result = ' +
            this.resultDrawingSelected +
            ')'

        /* Select any other users' drawing that's not already guessed by me */
        let querySelectNewDrawing = 'SELECT UserId, DrawingId, Data, Word FROM DRAWINGS WHERE ' +
            'DrawingId NOT IN (SELECT DrawingId FROM HISTORY WHERE HISTORY.UserId = ' +
            userId +
            ' AND HISTORY.Result != ' +
            this.resultDrawingSelected +
            ') AND DRAWINGS.UserId != ' + userId +
            ' AND DRAWINGS.Data IS NOT NULL';

        return DbConnection.runQuery(querySelectCurrentDrawing)
            .then(rows => {
                if (rows == null || rows.length == 0) {
                    return DbConnection.runQuery(querySelectNewDrawing)
                }
                return rows
            })
    }

    _getResultFromHistoryQuery(userId, drawingId) {
        return 'SELECT HISTORY.Result FROM HISTORY WHERE HISTORY.UserId = ' +
            mysql.escape(userId) +
            ' AND HISTORY.DrawingId = ' +
            mysql.escape(drawingId) +
            ' LIMIT 1';
    }

    _updateHistoryWithResultQuery(historyResult, userId, drawingId) {
        return 'UPDATE HISTORY SET HISTORY.Result = ' +
            historyResult +
            ' WHERE HISTORY.UserId = ' +
            userId +
            ' AND HISTORY.DrawingId = ' +
            drawingId +
            ' AND HISTORY.Result = ' +
            this.resultDrawingSelected;
    }

    _getCorrectWordQuery(drawingId) {
        return 'SELECT DRAWINGS.Word FROM DRAWINGS WHERE DRAWINGS.DrawingId = ' +
            drawingId;
    }

    _insertUserIdByDrawingIdToScoresQuery(drawingId) {
        return 'INSERT IGNORE INTO SCORES (UserId) SELECT UserId FROM DRAWINGS WHERE DRAWINGS.DrawingId = ' +
            drawingId
    }

    _insertUserIdToScoresQuery(userId) {
        return 'INSERT IGNORE INTO SCORES (UserId) VALUES(' + userId + ')'
    }

    _incDrawScoreQuery(drawingId) {
        return 'UPDATE SCORES SET SCORES.DrawScore = IFNULL(SCORES.DrawScore, 0) + 1' +
            ' WHERE SCORES.UserId = (SELECT UserId FROM DRAWINGS WHERE DRAWINGS.DrawingId = ' +
            drawingId + ')'
    }

    _incGuessScoreQuery(userId) {
        return 'UPDATE SCORES SET SCORES.GuessScore = IFNULL(SCORES.GuessScore, 0) + 1' +
            ' WHERE SCORES.UserId = ' + userId;
    }
}

module.exports = UserRepository
