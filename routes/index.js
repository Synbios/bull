var express = require('express');
var router = express.Router();



var mysql = require('mysql');

// database
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bull_development'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.send(req.cookies.user_id);
  if (req.cookies.user_id == undefined){
    res.redirect('/users/new');
  }
  else{
    res.redirect('/posts');
  }
});

/* resources users */

/* new */
router.get('/users/new', function(req, res, next) {
  connection.query('SELECT * FROM users', function(err, rows){
    res.render('users/new', {});
  });
});

/* create */
router.post('/users', function(req, res, next) {
  var name = req.body.name;
  if ( name == undefined ){
    res.render('users/new', { msg: "Please fill in all fields" });
  }
  else{
    console.log("SELECT * FROM users WHERE name = '"+name+"'");
    connection.query("SELECT * FROM users WHERE name = '"+name+"'", function(err, rows){
      if( rows.length > 0 ){
        //res.send("old user id = "+rows[0].id);
        res.cookie('user_id', rows[0].id);
        res.redirect('/posts');
      }
      else{
        connection.query("INSERT INTO users (name,updated_at,created_at) values('"+name+"',NOW(),NOW()) ", function(err, result){
          if(err){
            console.log(err);
          }
          else{
            connection.query("SELECT * FROM users WHERE id = "+result.insertId, function(err, rows){
              //res.send("new user id = "+result.insertId);
              //res.render('posts/show', { post : rows[0]});
              res.cookie('user_id', result.insertId);
              res.redirect('/posts');
            });
          }
        });
      }
    });
    
  }
});


/* resources posts */
/* index */
router.get('/posts', function(req, res, next) {
  connection.query('SELECT * FROM posts', function(err, rows){
    res.render('posts/index', {posts : rows});
  });
});

/* new */
router.get('/posts/new', function(req, res, next) {
  if (req.cookies.user_id == undefined){
    res.redirect('/users/new');
  }
  else{
    res.render('posts/new', {});
  }
});

/* create */
router.post('/posts', function(req, res, next) {
  
  //console.log(req.body);
  var title = req.body.title;
  var description = req.body.description;
  var user_id = req.cookies.user_id;
  if (title == undefined || description == undefined ){
    //res.redirect('/posts');
    res.render('posts/new', { msg: "Please fill in all fields" });
  }
  else{

    connection.query("INSERT INTO posts (user_id,title,description,updated_at,created_at) values("+user_id+",'"+title+"','"+description+"',NOW(),NOW()) ", function(err, result){
      if(err){
        console.log(err);
      }
      else{
        connection.query("SELECT * FROM posts WHERE id = "+result.insertId, function(err, rows){
          res.render('posts/show', { post : rows[0]});
        });
      }
    });
  }
  
  
});

/* show */
router.get('/posts/:id', function(req, res, next) {
  connection.query("SELECT * FROM posts WHERE id = "+req.params.id, function(err, rows){
    res.render('posts/show', { post : rows[0]});
  });
});


module.exports = router;
