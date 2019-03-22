var express = require('express');
var ctrl = require('../controller/controller.js');
var router = express.Router();

/* GET pages that are simple routes */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/createAccount', function(req, res) {
  res.render('createAccount');
});


/* GET pages that require controller logic */
router.get('/getRanks/:id', ctrl.getRanks);

router.post('/login', ctrl.login);

router.post('/createAccount', ctrl.createAccount);

router.get('/getCurriculum/:rankid/:categoryid', ctrl.getCurriculum);

module.exports = router;
