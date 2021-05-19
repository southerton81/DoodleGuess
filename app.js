var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var bodyParser = require('body-parser')
var session = require('client-sessions')
var routes = require('./routes/routes')
var cookieParser = require('cookie-parser')
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

app.use(cookieParser())

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json({ limit: 17825792 }))
app.use(bodyParser.urlencoded({ extended: false }))

function makeid(length) {
    var result           = '';
    var characters       = 'AB@DEFG#Iefgh^jklmn%pqr$tuvw(yz012)45-7=+JKLM!OPQ&STUV*XYZabcd';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

app.use(function (req, res, next) {
    var cookie = req.cookies.guessDrawCookie
    if (cookie === undefined) {
      res.cookie('guessDrawCookie', makeid(30), { httpOnly: true })
    } 
    next()
  }
)

app.use(
    session({
        cookieName: 'session',
        secret: 'ytxd76rytff67',
        duration: 400 * 24 * 3600 * 1000,
        activeDuration: 400 * 24 * 3600 * 1000
    })
) 

app.use(express.static(path.join(__dirname, 'public')))

app.use(function(req, res, next) {
    if (req.session && req.session.userName) {
        UserController.findUser(req.session.userName, function(
            err,
            user
        ) {
            if (user) {
                req.user = user
            } else {
                req.session.reset()
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
