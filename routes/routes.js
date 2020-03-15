var express = require('express')
var UserController = require('./../controllers/user_controller.js')
var DashboardController = require('./../controllers/dashboard_controller.js')
var router = express.Router()

router.get('/', function(req, res, next) {
    res.sendfile('public/index.html')
})

router.get('/loginpage', function(req, res, next) {
    res.sendfile('public/index.html')
})

router.get('/drawpage', function(req, res, next) {
    res.sendfile('public/index.html')
})

router.get('/guesspage', function(req, res, next) {
    res.sendfile('public/index.html')
})

router.post('/login', function(req, res, next) {
    UserController.login(req, res, next)
})

router.post('/logout', function(req, res, next) {
    UserController.logout(req, res, next)
})

router.get('/score', function(req, res, next) {
    DashboardController.getScore(req, res, next)
})

router.post('/draw', function(req, res, next) {
    DashboardController.saveDrawing(req, res, next)
})

router.get('/guess', function(req, res, next) {
    DashboardController.getDrawing(req, res, next)
})

router.post('/guess', function(req, res, next) {
    DashboardController.setGuess(req, res, next)
})


module.exports = router
