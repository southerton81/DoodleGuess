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


class DrawRepository {
    constructor() {
        this.resultDrawingGuessIncorrect = 0
        this.resultDrawingGuessCorrect = 1
        this.resultDrawingSelected = 2
        this.resultDrawingSkipped = 3
        this.resultDrawingHinted = 4
    }

    createEmptyDrawingWithWord(userId, word) {
        return new Promise((resolve, reject) => {
            let drawing = new Drawing(null, userId, word, null)
            var query = 'INSERT INTO drawings SET ' + mysql.escape(drawing)

            DbConnection.runQuery(query)
                .then(rows => {
                    let getDrawingIdQuery =
                        'SELECT * FROM drawings WHERE drawings.UserId = ' +
                        mysql.escape(userId) +
                        " AND drawings.Word = '" +
                        word +
                        "'" +
                        ' AND drawings.Data IS NULL LIMIT 1'

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
            var query =
                'UPDATE drawings SET drawings.Data = ' +
                mysql.escape(data) +
                ' WHERE drawings.DrawingId = ' +
                drawingId

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
            .then(result => {
                let rows = result.rowsResult
                let updateHistoryFlag = result.shouldUpdateHistoryFlag
                if (rows != null && rows.length > 0) {
                    let randomRow = Math.round(
                        Math.random() * (rows.length - 1)
                    )
                    let drawingId = rows[randomRow].DrawingId
                    let data = rows[randomRow].Data
                    let word = rows[randomRow].Word.trim()
                    let userName = rows[randomRow].Name

                    let guessDrawing = new GuessDrawing(drawingId, word, data, userName)

                    if (updateHistoryFlag) {
                        let history = new History(
                            userId,
                            guessDrawing.DrawingId,
                            this.resultDrawingSelected
                        )
                        var query = 'INSERT IGNORE INTO history SET ' + mysql.escape(history)
                        return DbConnection.runQuery(query).then(rows => {
                            return guessDrawing
                        })
                    } else {
                        return guessDrawing
                    }
                }
                return Promise.reject(
                    new DatabaseError(
                        'getRandomDrawing: No available drawings found'
                    )
                )
            })
            .catch(err => {
                return Promise.reject(err)
            })
    }

    getHint(userId, drawingId) {
        return DbConnection.runQuery(this._getCorrectWordQuery(drawingId))
            .then(rows => {
                let word = rows[0].Word.trim()

                return DbConnection.runQuery(
                    this._updateHistoryWithResultQuery(
                        this.resultDrawingHinted,
                        userId,
                        drawingId
                    )
                ).then(_ => Promise.resolve(word[0]))
            })
            .catch(err => {
                return Promise.reject(err)
            })
    }

    setGuess(userId, drawingId, guessWord) {
        return DbConnection.runQuery(this._getCorrectWordQuery(drawingId))
            .then(rows => {
                let word = rows[0].Word.trim()
                let isGuessed =
                    guessWord.toLowerCase().trim().localeCompare(word.toLowerCase()) ==
                        0
                        ? true
                        : false
                let guessResult = isGuessed
                    ? this.resultDrawingGuessCorrect
                    : this.resultDrawingGuessIncorrect

                if (isGuessed) {
                    return DbConnection.runQuery(this._getResultFromHistoryQuery(userId, drawingId))
                        .then(historyResult => {
                            let score = (historyResult[0].Result == this.resultDrawingHinted) ? 1 : 2;
                            return this._incrementScore(userId, drawingId, score).then(
                                _ => {
                                    return DbConnection.runQuery(
                                        this._updateHistoryWithResultQuery(
                                            guessResult,
                                            userId,
                                            drawingId
                                        )
                                    ).then(result => [result, word, score])
                                })
                        })
                } else {
                    return DbConnection.runQuery(
                        this._updateHistoryWithResultQuery(
                            guessResult,
                            userId,
                            drawingId
                        )
                    ).then(result => [result, word, 0])
                }
            })
            .then(([result, word, score]) => {
                return DbConnection.runQuery(
                    this._getResultFromHistoryQuery(userId, drawingId)
                ).then(result => [result, word, score])
            })
            .then(([rows, word, score]) => {
                let guessStatus = rows[0].Result
                return Promise.resolve(new GuessResult(guessStatus, word, score))
            })
            .catch(err => {
                return Promise.reject(err)
            })
    }

    skipDrawing(userId, drawingId) {
        return DbConnection.runQuery(
            this._updateHistoryWithResultQuery(
                this.resultDrawingSkipped,
                userId,
                drawingId
            )
        ).then(result => {
            return DbConnection.runQuery(
                this._getResultFromHistoryQuery(userId, drawingId)
            )
        })
    }

    _incrementScore(userId, drawingId, score) {
        return DbConnection.runQueriesInTransaction(
            this._insertUserIdToScoresQuery(userId), // Ensure that UserId's already
            this._insertUserIdByDrawingIdToScoresQuery(drawingId), // exist in a 'Scores' table
            this._incGuessScoreQuery(userId, score),
            this._incDrawScoreQuery(drawingId)
        )
    }

    _selectAvailableDrawings(userId) {
        let querySelectCurrentDrawing =
            'SELECT drawings.UserId, DrawingId, Data, Word, user.Name FROM drawings ' +
            'JOIN user ON user.UserId = drawings.UserId ' +
            'WHERE DrawingId = (SELECT DrawingId FROM history WHERE history.UserId = ' + userId +
            ' AND (history.Result = ' + this.resultDrawingSelected + ' OR history.Result = ' + this.resultDrawingHinted + ') ' +
            ' AND drawings.Valid >= 0 LIMIT 1)'

        /* Select any other users' drawing that's wasn't interacted by me */
        let querySelectNewDrawing =
            'SELECT drawings.UserId, DrawingId, Data, Word, user.Name FROM drawings ' +
            'JOIN user ON user.UserId = drawings.UserId ' +
            'WHERE DrawingId NOT IN (SELECT DrawingId FROM history WHERE history.UserId = ' +
            userId +
            ') AND drawings.UserId != ' +
            userId +
            ' AND drawings.Data IS NOT NULL' +
            ' AND drawings.Valid >= 0'

        return DbConnection.runQuery(querySelectCurrentDrawing).then(rows => {
            if (rows == null || rows.length == 0) {
                return DbConnection.runQuery(querySelectNewDrawing).then(rows => {
                    return { rowsResult: rows, shouldUpdateHistoryFlag: true }
                }
                )
            }
            return { rowsResult: rows, shouldUpdateHistoryFlag: false }
        })
    }

    _getResultFromHistoryQuery(userId, drawingId) {
        return (
            'SELECT history.Result FROM history WHERE history.UserId = ' +
            mysql.escape(userId) +
            ' AND history.DrawingId = ' +
            mysql.escape(drawingId) +
            ' LIMIT 1'
        )
    }

    _updateHistoryWithResultQuery(historyResult, userId, drawingId) {
        return (
            'UPDATE history SET history.Result = ' +
            historyResult +
            ' WHERE history.UserId = ' +
            userId +
            ' AND history.DrawingId = ' +
            drawingId +
            ' AND (history.Result = ' +
            this.resultDrawingSelected +
            ' OR history.Result = ' +
            this.resultDrawingHinted +
            ')'
        )
    }

    _getCorrectWordQuery(drawingId) {
        return (
            'SELECT drawings.Word FROM drawings WHERE drawings.DrawingId = ' +
            drawingId
        )
    }

    _insertUserIdByDrawingIdToScoresQuery(drawingId) {
        return (
            'INSERT IGNORE INTO scores (UserId) SELECT UserId FROM drawings WHERE drawings.DrawingId = ' +
            drawingId
        )
    }

    _insertUserIdToScoresQuery(userId) {
        return 'INSERT IGNORE INTO scores (UserId) VALUES(' + userId + ')'
    }

    _incDrawScoreQuery(drawingId) {
        return (
            'UPDATE scores SET scores.DrawScore = IFNULL(scores.DrawScore, 0) + 1' +
            ' WHERE scores.UserId = (SELECT UserId FROM drawings WHERE drawings.DrawingId = ' +
            drawingId +
            ')'
        )
    }

    _incGuessScoreQuery(userId, score) {
        return (
            'UPDATE scores SET scores.GuessScore = IFNULL(scores.GuessScore, 0) + ' + score +
            ' WHERE scores.UserId = ' +
            userId
        )
    }
}

module.exports = DrawRepository