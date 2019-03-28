var express = require('express');
var ctrl = require('../controller/controller.js');
var router = express.Router();

/* GET pages that are simple routes */
router.get('/', function(req, res, next) {
  if(req.session.data) {
    res.render('dashboard');
  } else {
    res.render('index');
  }
});

router.get('/createAccount', function(req, res) {
  res.render('createAccount');
});


/* GET & POST pages that require controller logic */
router.get('/getRanks/:id', ctrl.getRanks);

router.post('/login', ctrl.login);

router.get('/login', ctrl.login);

router.get('/logout', ctrl.logout);

router.post('/createAccount', ctrl.createAccount);

router.get('/getCurriculum/:rankid/:categoryid', ctrl.getCurriculum);

router.get('/studentInfo', ctrl.studentInfo);

router.get('/changeCurrentRank/:rankid', ctrl.changeCurrentRank);

module.exports = router;
