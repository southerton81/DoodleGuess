var User = require('./../models/user.js')
var Drawing = require('./../models/drawing.js')
var DbConnection = require('./../db/db_connection.js')
var mysql = require('mysql')
var Promise = require('promise')
var DatabaseError = require('./../error/errors.js').DatabaseError
var UserRepository = require('./../repositories/user_repository.js')

const userRepository = new UserRepository()

/**
 * Main game controller, may be divided into DrawingController, GuessController, ScoreController
 */
DashboardController = {}

DashboardController.createDrawing = function (req, res, next) {
    userRepository
        .createEmptyDrawingWithWord(req.user.UserId, 'sun')
        .then(drawing => {
            res.status(201).json(drawing).end()
        })
        .catch(err => {
            return next(err)
        })
}

DashboardController.saveDrawing = function (req, res, next) {
    let drawingId = req.body.drawingId
    let data = req.body.image

    userRepository
        .putUserDrawing(drawingId, data)
        .then(_ => {
            res.status(201)
            res.end()
        })
        .catch(err => {
            return next(err)
        })
}

DashboardController.getDrawing = function (req, res, next) {
    userRepository
        .getRandomDrawing(req.user.UserId)
        .then(drawing => {
            let drawingId = drawing.DrawingId
            let data = drawing.Data
            let wordLength = drawing.Word.length
            res.json({ drawingId, data, wordLength })
            res.status(200)
            res.end()
        })
        .catch(err => {
            console.log(err)
            if (err instanceof DatabaseError) {
                res.status(404)
                res.end()
            }
            return next(err)
        })
}

DashboardController.getScore = function (req, res, next) {
    userRepository
        .getUserScore(req.user.UserId)
        .then(score => {
            res.status(200)
            res.json(score)
            res.end()
        })
        .catch(err => {
            return next(err)
        })
}

DashboardController.setGuess = function (req, res, next) {
    userRepository.setGuess(req.user.UserId, req.body.drawingId, req.body.word)
        .then(result => {
            res.status(200)
            res.json({ result }).end()
        }).catch(err => {
            return next(err)
        })
}


module.exports = DashboardController
