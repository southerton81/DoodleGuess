var express = require('express')
var UserController = require('./../controllers/user_controller.js')
var DashboardController = require('./../controllers/dashboard_controller.js')
var router = express.Router()

router.get('/', function(req, res, next) {
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

router.post('/voice', function(req, res, next) {
    let soundFile = req.read()

    DbConnection.runQuery(
        'UPDATE INTERIM_SPEAKTURN SET Voice = ? WHERE UserId = ?',
        [soundFile, req.userId]
    )
        .then(rows => {
            console.log(rows)
        })
        .catch(error => {
            return next(error)
        })

    res.status(200).end()
})

module.exports = router
