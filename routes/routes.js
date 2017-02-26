var express = require('express');
var UserController = require('./../controllers/user_controller.js');
var DashboardController = require('./../controllers/dashboard_controller.js');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.sendfile('public/index.html');
});

router.post('/login', function (req, res, next) {
  UserController.login(req, res, next);
});

router.post('/logout', function (req, res, next) {
  UserController.logout(req, res, next);
});

router.get('/dashboard', function (req, res, next) {
  DashboardController.getState(req, res, next);
});

router.post('/voice', function (req, res, next) {
  console.log(req.read());

/*
  let insertVoiceQuery = 'INSERT INTO INTERIM_SPEAKTURN VALUES (' + userId + ', \'' +
    imageLinks.selectedImage + '\', ' + '\'' + images + '\', null);';
  DbConnection.runQuery(insertNewSpeakTurnQuery);
*/



  res.status(200).end();
});

module.exports = router;
