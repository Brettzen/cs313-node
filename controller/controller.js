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
  if(req.session.data) {
    // Get fitness stats for the student
    model.getFitness(student.username, function(err, result) {
      if(err || result == null || result.length < 1) {

      } else {
        fitness = result[0];
        req.session.fitness = fitness;

        // console.log("Fitness:", fitness);
        res.render('dashboard', { student: student, ranks: ranks, fitness:fitness });
      }
    });
  } else if (!req.body.username){
    res.render('index');
  } else {
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
            student = result[0];
            student.currentrank = student.rankname;
            student.currentrankid = student.rankid;
            // console.log("Student Data: ", student);
            req.session.data = student;

            // Get ranks for belt select
            model.getRanksFromDB(student.rankid, function(err, result) {
              if(err || result == null || result.length < 1) {
                ranks = [
                  {
                    rankid : student.rankid,
                    rankname : student.rankname,
                  }
                ]
              } else {
                ranks = result;
                req.session.ranks = ranks;

                // Get fitness stats for the student
                model.getFitness(student.username, function(err, result) {
                  if(err || result == null || result.length < 1) {

                  } else {
                    fitness = result[0];
                    req.session.fitness = fitness;

                    // console.log("Fitness:", fitness);
                    res.render('dashboard', { student: student, ranks: ranks, fitness:fitness });
                  }
                });
              }
            });
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
          // console.log("SUCCESS ADDING USER: ", result);
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

exports.studentInfo = function (req, res) {
  res.json(student);
}

exports.changeCurrentRank = function (req, res) {
  // console.log(req.params.rankid);
  // console.log(student.currentrankid);
  student.currentrankid = req.params.rankid;
  // console.log("new student current rank id:" , student.currentrankid);
  model.getRankNameAndColors(student.currentrankid, function(err, result) {
    if(err || result == null || result.length < 1) {
      console.log("ERROR! " + err);
      console.log("RESULT.LENGTH: " + result.length);
      console.log("RESULT: " + JSON.stringify(result));
      res.json("ERROR: " + err);
    } else {
      res.json(result);
    }
  });
}

exports.getCurriculum = function (req, res) {
  data = {
    rankid: Number(req.params.rankid),
    categoryid: Number(req.params.categoryid)
  }

  model.getCurriculum(data, function(err, result) {
    if(err || result == null || result.length < 0) {
      console.log("ERROR! " + err);
      console.log("RESULT.LENGTH: " + result.length);
      console.log("RESULT: " + JSON.stringify(result));
      return;
    } else if(result.length == 0) {
      data = {
        msg: "<h3>There is currently no curriculum available for this belt and category.</h3>"
      }
      res.json(data);
    } else {
      res.json(result);
    }
  });
}

exports.addFitness = function (req, res) {
  data = {
    studentid: req.session.data.studentid,
    pushups: Number(req.query.pushups),
    legraises: Number(req.query.legraises),
    pullups: Number(req.query.pullups),
    jumps: Number(req.query.jumps),
    roundright: Number(req.query.roundright),
    roundleft: Number(req.query.roundleft),
    roundtime: Number(req.query.roundtime),
    stretch: Number(req.query.stretch)
  };
  model.addFitness(data, function(err, result) {
    if(err || result != 1) {
      res.json(0);
    } else {
      res.json(1);
    }
  });
}

exports.logout = function (req, res) {
  if (req.session.data) {
    req.session.destroy();
    res.json(true);
    res.end();
  } else {
    res.json(false);
    res.end();
  }
}

function buildCategoryMenu(categories) {
  var categoryMenu = "";
  categories.forEach(function(category) {
    if (category['categoryid'] < 7) {
      // console.log(category['stripecolor']);
      categoryMenu += "<div class='" + category['stripecolor'] + "-stripe'>" + category['categoryename'] + "</div>";
    }
  });
  return categoryMenu;
}
