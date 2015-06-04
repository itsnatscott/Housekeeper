var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require("sqlite3").verbose();
var cors = require('cors');
var bcrypt = require('bcrypt');
var session = require('express-session')
var secret = require('./secret.json');
var db = new sqlite3.Database("db/housekeeper.db")
var app = express();

app.use(session({
	secret: secret.password,
	resave: false,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));



app.get('/', function(req,res){
	res.sendFile('login.html', { root: __dirname });
});
app.post('/user', function(req,res){
	console.log('new user');
	var username = req.body.username;
	var password = req.body.password;
	var confirm_password = req.body.confirm_password;
	if(password != confirm_password){
		res.redirect('/');
	}else{
		var hash = bcrypt.hashSync(form.Password, 10)
		db.run("INSERT INTO users (username, password) VALUES (?,?)", username, hash, function(err){
			if(err) {throw err;}
			console.log('here');
			req.session.valid_user = true;
			res.redirect('/secret_page');
		});
	}
});

app.post('/session', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.get("SELECT * FROM users WHERE username = ?", username, function(err, row) {
          if(err) { throw err; }
          if(row) {
            var passwordMatches = bcrypt.compareSync(password, row.password);
              if(passwordMatches) {
                req.session.valid_user = true;
                req.user = row.username;
                res.redirect('/secret_page');
              }
              else {
                res.redirect('/');
              }
            } else {
              res.redirect('/');
            }
          });
        });

app.get('/secret_page', function(req,res){
	if(req.session.valid_user){
		res.send('Hello! <a href ="http://localhost:3000/secret_page2">Secret Page 2</a>')
	}else{ res.redirect('/')
}
});

app.get('/secret_page2', function(req,res){
	if(req.session.valid_user) {
		res.send('Hello Again <a href = "http://localhost:3000/secret_page">Secret Page');
	}else{
		res.redirect('/')
	}
});








app.listen(3000);

console.log('Listening on port 3000');