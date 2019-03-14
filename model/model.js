var express = require('express');

const connectionString = process.env.DATABASE_URL;

const {Pool, Client} = require('pg');
const pool = new Pool({connectionString: connectionString});
const client = new Client({connectionString: connectionString});

exports.getRanksFromDB = function(id, callback) {
  console.log("getRanksFromDB called with ID: ", id);

  var sql = "SELECT * FROM ranks WHERE rankid = $1::int";
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
