var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var bodyParser = require('body-parser')
var routes = require('./routes/routes')

require('events').EventEmitter.defaultMaxListeners = 128

var app = express()

// Force https on Heroku
if (process.env.NODE_ENV == 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`)
        else
            next()
    })
}

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', "origin, content-type, accept, x-user-name, x-auth-token")
    res.setHeader('Access-Control-Allow-Credentials', true) 
    next()
})

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json({ limit: 17825792 }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(function(req, res, next) {
    let userName = req.header('x-user-name')
    let password = req.header('x-auth-token')
    if (userName && password) {
        UserController.findUser(userName, password, function(err,user) {
            if (user) {
                req.user = user
            } 
            next()
        })
    } else {
        next()
    }
})

app.use('/', routes)
 
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})
 
app.use(function(err, req, res, next) {
    if (err.code != "ECONNREFUSED" && (!req.user || !req.user.UserId)) {
        res.status(401)
    } else {
        res.status(err.status || 500)
    } 

    res.end()
    if (err.stack) {
        console.log(err.stack)
    }
})


module.exports = app
