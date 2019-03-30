var express = require('express');
var ctrl = require('../controller/controller.js');
var model = require('../model/model.js');
var router = express.Router();

/* GET pages that are simple routes */
router.get('/', function(req, res, next) {
  if(req.session.data) {
    model.getFitness(req.session.data.username, function(err, result) {
      if(err || result == null || result.length < 1) {
        res.render('index');
      } else {
        fitness = result[0];
        req.session.fitness = fitness;
        console.log("Fitness:", fitness);
        res.render('dashboard', { fitness:fitness });
      }
    });
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

router.get('/addFitness', ctrl.addFitness);

module.exports = router;
