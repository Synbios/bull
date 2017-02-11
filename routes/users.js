var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');


/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM users', function(err, rows){
    //res.render('users', {users : rows});
    res.send("ok");
  });
});

module.exports = router;
