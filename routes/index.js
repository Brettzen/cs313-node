var express = require('express');
var ctrl = require('../controller/controller.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Express.js" });
});

router.get('/getRanks/:id', ctrl.getRanks);

module.exports = router;
