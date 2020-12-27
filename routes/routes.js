var express = require('express')
var UserController = require('./../controllers/user_controller.js')
var DashboardController = require('./../controllers/dashboard_controller.js')
var router = express.Router()

router.get('/', function (req, res, next) {
    res.sendfile('public/index.html')
})

router.get('/l', function (req, res, next) {
    res.sendfile('public/index.html')
})

router.get('/d', function (req, res, next) {
    res.sendfile('public/index.html')
})

router.get('/g', function (req, res, next) {
    res.sendfile('public/index.html')
})

router.post('/login', function (req, res, next) {
    UserController.login(req, res, next)
})

router.post('/logout', function (req, res, next) {
    UserController.logout(req, res, next)
})

router.get('/score', function (req, res, next) {
    if (checkUserId(req))
        DashboardController.getScore(req, res, next)
})

router.get('/scores', function (req, res, next) {
    if (checkUserId(req))
        DashboardController.getHighscores(req, res, next)
})

router.get('/guess', function (req, res, next) {
    DashboardController.getDrawing(req, res, next)
})

router.post('/guess', function (req, res, next) {
    if (checkUserId(req))
        DashboardController.setGuess(req, res, next)
})

router.post('/skip', function (req, res, next) {
    DashboardController.skipDrawing(req, res, next)
})

/**
 * Create new drawing with a word and id in database
 */
router.post('/createDrawing', function (req, res, next) {
    if (checkUserId(req))
        DashboardController.createDrawing(req, res, next)
})

/**
 * Add drawing data to alraeady created drawing by id
 */
router.post('/draw', function (req, res, next) {
    if (checkUserId(req))
        DashboardController.saveDrawing(req, res, next)
})

function checkUserId(req) {
    if (!req.user.UserId) {
        res.status(401)
        res.end()
        return false
    } 
    return true
}

module.exports = router
