var express = require('express');
var model = require('../model/model.js');

// Controller Functions
exports.getRanks = function(req, res) {
  console.log("getRanks controller function");

  var id = req.params.id;

  model.getRanksFromDB(id, function(err, result) {
    console.log("DB RESULTS: ", result);
    res.json(result);
  });

}
