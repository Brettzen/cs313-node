var express = require('express');
var model = require('../model/model.js');

const bcrypt = require('bcrypt');

// Controller Functions
exports.getRanks = function(req, res) {
  console.log("getRanks controller function");

  var id = req.params.id;

  model.getRanksFromDB(id, function(err, result) {
    if(err || result == null || result.length != 1) {
      response.status(500).json({success: false, data: error});
    } else {
      res.json(result[0]);
    }
  });
}

exports.login = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  model.checkPassword(username, function(err, result) {
    console.log("Checking Password");
    if(err || result == null || result.length != 1) {
      msg = {
        msg: 'There was a problem signing in. Please verify your credentials and try again.',
        msgclass: 'danger'
      }
      res.render('index', { msg: msg.msg, msgclass: msg.msgclass });
    } else if(bcrypt.compareSync(password, result[0].password)) {
      model.getUser(username, function(err, result) {
        if(err || result == null || result.length != 1) {
          msg = {
            msg: 'There was a problem signing in. Please verify your credentials and try again.',
            class: 'danger'
          }
          res.render('index', msg);
        } else {
          data = result[0];
          console.log("Student Data: ", data);
          res.render('dashboard', data );
        }
      });
    } else {
      console.log("Password incorrect.");
      msg = {
        msg: 'Your password was incorrect. Please verify your credentials and try again.',
        msgclass: 'danger'
      }
      console.log(msg);
      res.render('index', { msg: msg.msg, msgclass: msg.msgclass });
    }
  });
}

exports.createAccount = function(req, res) {
  if(req.body.password != req.body.passwordConfirm) {
    var error = "Your passwords do not match.";
    res.render("createAccount", { error: error });
    return;
  }

  var data = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    rankid: req.body.rankid,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10)
  }

  model.checkUsername(data.username, function(err, result) {
    if(result.length > 0) {
      var error = "That username already exists in the system.";
      res.render("createAccount", { error: error });
      return;
    } else {
      model.addUser(data, function(err, result) {
        if(err || result == null) {
          var error = "There was an error. Please check your entry and try again.";
          res.render("createAccount", { error: error });
          return;
        } else {
          console.log("SUCCESS ADDING USER: ", result);
          msg = {
            msg: 'Username created successfully. Sign in now!',
            msgclass: 'success'
          };

          res.render('index', { msg: msg.msg, msgclass: msg.msgclass });
        }
      });
    }
  });

}
