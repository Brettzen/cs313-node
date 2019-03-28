var express = require('express');

const connectionString = process.env.DATABASE_URL;

const bcrypt = require('bcrypt');

const {Pool, Client} = require('pg');
const pool = new Pool({connectionString: connectionString});
const client = new Client({connectionString: connectionString});

exports.getRanksFromDB = function(id, callback) {
  console.log("getRanksFromDB called with rankid: ", id);

  var sql = "SELECT rankid, rankname FROM ranks WHERE rankid <= $1::int ORDER BY rankid DESC";
  var params = [id];

  pool.query(sql, params, function(err, result) {
    if (err) {
      console.log("ERROR! ", err);
      callback(err, null);
    }

    console.log("DB RESULTS: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });
}

exports.checkPassword = function(username, callback) {
  console.log("Checking password in the DB...");

  var sql = "SELECT password FROM students WHERE username = $1::text";
  var params = [username];

  pool.query(sql, params, function(err, result) {
    if (err) {
      console.log("ERROR! ", err);
      callback(err, null);
    }

    callback(null, result.rows);
  });
}

exports.getUser = function(username, callback) {
  console.log("Getting user data from the DB...");

  var sql = "SELECT studentid, rankid, rankname, username, firstname, lastname, gender FROM students WHERE username = $1::text";
  var params = [username];

  pool.query(sql, params, function(err, result) {
    if (err) {
      console.log("ERROR! ", err);
      callback(err, null);
    }

    console.log("DB RESULTS: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });
}

exports.checkUsername = function(username, callback) {
  console.log("Checking username in the DB...");

  var sql = "SELECT username FROM students WHERE username = $1::text";
  var params = [username];

  pool.query(sql, params, function(err, result) {
    if (err) {
      console.log("ERROR! ", err);
      callback(err, null);
    }

    console.log("DB RESULTS FOR CHECKUSERNAME: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });
}

exports.getRankName = function(rankid, callback) {
  console.log("Getting rank name in the DB... rankid is: ", rankid);

  var sql = "SELECT rankname FROM ranks WHERE rankid = $1::int";
  var params = [rankid];

  pool.query(sql, params, function(err, result) {
    if (err) {
      console.log("ERROR! ", err);
      callback(err, null);
    }

    console.log("DB RESULTS FOR GETRANKNAME: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });
}

exports.addUser = function(data, callback) {
  console.log("Attempting to add user in the DB...");

  var sql = "INSERT INTO students (firstname, lastname, gender, rankid, rankname, username, password) VALUES ($1::text, $2::text, $3::gender, $4::int, (SELECT rankname FROM ranks WHERE rankid = $4::int), $5::text, $6::text)";
  var params = [data.firstname, data.lastname, data.gender, data.rankid, data.username, data.password];

  pool.query(sql, params, function(err, result) {
    if (err) {
      console.log("ERROR! ", err);
      callback(err, null);
    }

    console.log("DB RESULTS: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });
}

exports.getCurriculum = function(data, callback) {
  console.log("Attempting to get curriculum in the DB...");

  var sql = "SELECT t.techniquekname, t.techniqueename, t.techniquedesc, i.imgsrc, c.categorykname, c.categorydesc FROM techniques t LEFT JOIN technique_images i ON t.techniqueid = i.techniqueid INNER JOIN curriculum_categories c ON t.categoryid = c.categoryid WHERE t.rankid = $1::int AND t.categoryid = $2::int";
  var params = [data.rankid, data.categoryid];

  pool.query(sql, params, function(err, result) {
    if (err) {
      console.log("ERROR! ", err);
      callback(err, null);
    }

    console.log("DB RESULTS: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });
}
