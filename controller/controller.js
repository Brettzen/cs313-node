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
          data.currentrank = data.rankname;
          console.log("Student Data: ", data);
          // var categoryMenu = buildCategoryMenu(data.studentid);
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
        msg: "<h3>No curriculum currently available for this belt and category.</h3>"
      }
      res.json(data);
      res.end();
    } else {
      res.json(result);
      res.end();
    }
  });
}

function createEditableFitnessTable(rankId, fitness) {
    var fitnessTable = "<h3 class='student-welcome'>Physical Fitness</h3>";
    fitnessTable += "<p class='student-welcome'>These are your stats from the last physical fitness test.</p>";
    fitnessTable += "<table class='curriculum-fitness student-welcome'>";
    fitnessTable += "<tr>";
    fitnessTable += "<th>Pushups: " + fitness[0]['pushupsstyle'] + "</th>";
    fitnessTable += "<td class='fitness-noedit pushups'>" + fitness[0]['pushups'] + "</td>";
    fitnessTable += "<td class='fitness-edit'><input name='pushups' id='pushups'></td>";
    fitnessTable += "</tr>";
    fitnessTable += "<tr>";
    fitnessTable += "<th>Leg Raises: " + fitness[0]['legraisesstyle'] + "</th>";
    fitnessTable += "<td class='fitness-noedit legraises'>" + fitness[0]['legraises'] + "</td>";
    fitnessTable += "<td class='fitness-edit'><input name='legraises' id='legraises'></td>";
    fitnessTable += " </tr>";
    fitnessTable += "<tr>";
    fitnessTable += "<th>Pullups: " + fitness[0]['pullupsstyle'] + "</th>";
    fitnessTable += "<td class='fitness-noedit pullups'>" + fitness[0]['pullups'] + "</td>";
    fitnessTable += "<td class='fitness-edit'><input name='pullups' id='pullups'></td>";
    fitnessTable += "</tr>";
    fitnessTable += "<tr>";
    fitnessTable += "<th>Jumps: " + fitness[0]['jumpsstyle'] + "</th>";
    fitnessTable += "<td class='fitness-noedit jumps'>" + fitness[0]['jumps'] + "</td>";
    fitnessTable += "<td class='fitness-edit'><input name='jumps' id='jumps'></td>";
    fitnessTable += "</tr>";
    fitnessTable += "<tr>";
    fitnessTable += "<th class='fitness-noedit'>Roundhouse Kicks (<span class='roundtime'>" + fitness[0]['roundtime'] + "</span> per leg)</th>";
    fitnessTable += "<th class='fitness-edit'>Roundhouse Kicks (<input name='roundtime' id='roundtime'> seconds per leg)</th>";
    fitnessTable += "<td class='fitness-noedit'>R-<span class='roundright'>" + fitness[0]['roundright'] + "</span> / L-<span class='roundleft'>" + fitness[0]['roundleft'] + "</span></td>";
    fitnessTable += "<td class='fitness-edit'>R-<input name='roundright' id='roundright'> / L-<input name='roundleft' id='roundleft'></td>";
    fitnessTable += "</tr>";
    fitnessTable += "<tr>";
    fitnessTable += "<th>Stretch Test: " + fitness[0]['stretchstyle'] + "</th>";
    fitnessTable += "<td class='fitness-noedit stretch'>" + fitness[0]['stretch'] + "\"</td>";
    fitnessTable += "<td class='fitness-edit'><input name='stretch' id='stretch'>\"</td>";
    fitnessTable += "</tr>";
    fitnessTable += "</table> ";

    fitnessTable += '<button class="fitness-noedit btn btn-primary student-welcome" id="editFitness">Edit Fitness Stats</button>';
    fitnessTable += '<button class="fitness-edit btn btn-primary student-welcome" id="saveFitness">Save Fitness Stats</button>';
    fitnessTable += '<button class="fitness-edit btn btn-danger student-welcome" id="cancelFitness">Cancel</button>';

    return fitnessTable;
}

function createBeltSelect(rankId, ranks) {
  beltSelect = "<aside class='belt-select belt-select7'>";
  beltSelect += "<span>Selected Belt Rank: </span>";
  beltSelect += "<select>";
  ranks.forEach(function(rank) {
      if (rank['rankid'] == rankId) {
          beltSelect += "<option value='rank[rankid]' selected>rank[rankname]</option>";
      } else {
          beltSelect += "<option value='rank[rankid]'>rank[rankname]</option>";
      }
  });
  beltSelect += "</select>";
  beltSelect += "</aside>";

  return beltSelect;
}

function buildCategoryMenu(categories) {
  var categoryMenu = "";
  categories.forEach(function(category) {
    if (category['categoryid'] < 7) {
      console.log(category['stripecolor']);
      categoryMenu += "<div class='" + category['stripecolor'] + "-stripe'>" + category['categoryename'] + "</div>";
    }
  });
  return categoryMenu;
}
