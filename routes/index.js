var express = require('express');
var router = express.Router();

const connectionString = process.env.DATABASE_URL;

const {Pool, Client} = require('pg');
const pool = new Pool({connectionString: connectionString});
const client = new Client({connectionString: connectionString});

/* GET home page. */
router.get('/', function(req, res, next) {

  query = "SELECT * FROM ranks";

  pool.query(query, function(err, result) {
    if(err) {
      console.log("ERROR: " + err);
    } else {
      res.write(JSON.stringify(result.rows))
      res.end();
    }
    pool.end();

  })

  res.render('index', { title: 'Express' });
});

module.exports = router;
