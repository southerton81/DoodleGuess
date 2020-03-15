var User = require('./../models/user.js')
var Drawing = require('./../models/drawing.js')
var DbConnection = require('./../db/db_connection.js')
var mysql = require('mysql')
var Promise = require('promise')
var DatabaseError = require('./../error/errors.js').DatabaseError
var UserRepository = require('./../repositories/user_repository.js')

const userRepository = new UserRepository()

DashboardController = {}

DashboardController.saveDrawing = function(req, res, next) {
    if (!req.user.UserId) {
        res.status(401)
        res.end()
    } else {
        let word = req.body.word
        let data = req.body.image
        let drawing = new Drawing(null, req.user.UserId, word, data)

        userRepository
            .putUserDrawing(drawing)
            .then(_ => {
                res.status(201)
                res.end()
            })
            .catch(err => {
                return next(err)
            })
    }
}

DashboardController.getDrawing = function(req, res, next) {
    if (!req.user.UserId) {
        res.status(401)
        res.end()
    } else {
        userRepository
            .getRandomDrawing(req.user.UserId)
            .then(drawing => {
                res.json(drawing)
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
}

DashboardController.getScore = function(req, res, next) {
    if (!req.user.UserId) {
        res.status(401)
        res.end()
    } else {
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
}

DashboardController.setGuess = function(req, res, next) {
    if (!req.user.UserId) {
        res.status(401)
        res.end()
    } else {
        userRepository
            .setGuess(req.user.UserId, req.body.drawingId, req.body.word)
           
    }
}

module.exports = DashboardController
