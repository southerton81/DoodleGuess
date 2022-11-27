var express = require('express')
let fs = require('fs')
var UserController = require('./../controllers/user_controller.js')
var DashboardController = require('./../controllers/dashboard_controller.js')
var CommentsController = require('./../controllers/comments_controller.js')
var AdminController = require('./../controllers/admin_controller.js')
var router = express.Router()

let adminPwd = fs.readFileSync('./config/adminPwd').toString() 

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

router.get('/h', function (req, res, next) {
    res.sendfile('public/index.html')
})

router.get('/r', function (req, res, next) {
    res.sendfile('public/index.html')
})

router.get('/del', function (req, res, next) {
    res.sendfile('public/index.html')
})

router.get('/score', function (req, res, next) {
    DashboardController.getScore(req, res, next)
})

router.get('/scores', function (req, res, next) {
    DashboardController.getHighscores(req, res, next)
})

router.get('/guess', function (req, res, next) {
    DashboardController.getDrawing(req, res, next)
})

router.get('/hint', function (req, res, next) {
    DashboardController.getHint(req, res, next)
})

router.get('/comments', function (req, res, next) {
    CommentsController.getComments(req, res, next)
})

router.get('/news', function (req, res, next) {
    DashboardController.getNews(req, res, next)
})

router.post('/login', function (req, res, next) {
    UserController.login(req, res, next)
})

router.post('/logout', function (req, res, next) {
    UserController.logout(req, res, next)
})

router.post('/comment', function (req, res, next) {
    CommentsController.createComment(req, res, next)
})

router.post('/guess', function (req, res, next) {
    DashboardController.setGuess(req, res, next)
})

router.post('/skip', function (req, res, next) {
    DashboardController.skipDrawing(req, res, next)
})

router.delete('/user', function (req, res, next) {
    UserController.deleteUser(req, res, next)
})

/**
 * Create new drawing with a word and id in database
 */
router.post('/createDrawing', function (req, res, next) {
    DashboardController.createDrawing(req, res, next)
})

/**
 * Add drawing data to already created drawing by id
 */
router.post('/draw', function (req, res, next) {
    DashboardController.saveDrawing(req, res, next)
})

/**
 * Admin requests
 */
router.get('/adminNextDrawing', function (req, res, next) {
    if (protectRoute(req, res)) {
        AdminController.validateNext(req, res, next)
    }
})

router.post('/drawingValidity', function (req, res, next) {
    if (protectRoute(req, res)) {
        AdminController.drawingValidity(req, res, next)
    }
})
 
/* Utility */
function protectRoute (req, res) {
    const reject = () => {
        res.setHeader('www-authenticate', 'Basic')
        res.sendStatus(401)
        return false
    }

    const authorization = req.headers.authorization

    if (!authorization) {
        return reject()
    }

    const [username, password] = Buffer.from(authorization.replace('Basic ', ''), 'base64').toString().split(':')

    if (!(username === '' && password === adminPwd)) {
       return reject()
    }

    return true
}


module.exports = router
