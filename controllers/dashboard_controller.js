var DatabaseError = require('./../error/errors.js').DatabaseError
var UserRepository = require('./../repositories/user_repository.js')
var NewsRepository = require('./../repositories/news_repository.js')
var DrawRepository = require('./../repositories/draw_repository.js')

const userRepository = new UserRepository()
const newsRepository = new NewsRepository()
const drawRepository = new DrawRepository()

const fs = require('fs')

/**
 * Main game controller, may be divided into DrawingController, GuessController, ScoreController
 */
DashboardController = {}

let stringArray = []

DashboardController._getRandomWord = function () {
    return new Promise(function (resolve, reject) {
        if (stringArray.length == 0) {
            fs.readFile('./nouns', 'utf8', (err, data) => {
                if (err) {
                    return reject(err)
                }
                stringArray = data.split(/\n/)
                let index = Math.round(Math.random() * (stringArray.length - 1))
                return resolve(stringArray[index].trim())
            })
        } else {
            let index = Math.round(Math.random() * (stringArray.length - 1))
            return resolve(stringArray[index].trim())
        }
    })
}

DashboardController.createDrawing = function (req, res, next) {
    this._getRandomWord()
        .then(word => {
            drawRepository
                .createEmptyDrawingWithWord(req.user.UserId, word)
                .then(drawing => {
                    res.status(201).json(drawing).end()
                })
        })
        .catch(err => {
            return next(err)
        })
}

DashboardController.saveDrawing = function (req, res, next) {
    let drawingId = req.body.drawingId
    let data = req.body.image

    drawRepository
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
    drawRepository
        .getMostRecentDrawing(req.user.UserId)
        .then(drawing => {
            let drawingId = drawing.DrawingId
            let data = drawing.Data
            let wordLength = drawing.Word.length
            let userName = drawing.UserName
            res.json({drawingId, data, wordLength, userName})
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

DashboardController.getHighscores = function (req, res, next) {
    userRepository
        .getHighscores()
        .then(scores => {
            res.status(200)
            res.json(scores)
            res.end()
        })
        .catch(err => {
            return next(err)
        })
}

DashboardController.getHint = function (req, res, next) {
    drawRepository
        .getHint(req.user.UserId, req.query.drawingId)
        .then(hint => {
            res.status(200)
            res.json(hint)
            res.end()
        })
        .catch(err => {
            return next(err)
        })
}

DashboardController.setGuess = function (req, res, next) {
    drawRepository.setGuess(req.user.UserId, req.body.drawingId, req.body.word)
        .then(result => {
            res.status(200) 
            res.json({ result }).end()
        }).catch(err => {
            return next(err)
        })
}

DashboardController.skipDrawing = function (req, res, next) {
    drawRepository.skipDrawing(req.user.UserId, req.body.drawingId)
        .then(result => {
            return DashboardController.getDrawing(req, res, next)
        }).catch(err => {
            return next(err)
        })
}

DashboardController.getNews = function (req, res, next) {
    newsRepository
        .getNews(req.user.UserId)
        .then(news => {
            res.status(200)
            res.json(news)
            res.end()
        })
        .catch(err => {
            return next(err)
        })
}

module.exports = DashboardController
