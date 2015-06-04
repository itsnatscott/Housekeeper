var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require("sqlite3").verbose();
var cors = require('cors');
var bcrypt = require('bcrypt');
var session = require('express-session')
var secret = require('./secret.json');
var db = new sqlite3.Database("db/housekeeper.db")
var app = express();

///point server to where index is
app.use(express.static('public'));
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: secret.password,
	resave: false,
	saveUninitialized: true
}));




app.get('/', function(req,res){
	res.sendFile('login.html', { root: __dirname });
});
app.post('/user', function(req,res){
	console.log('new user');
	var username = req.body.username;
	var formPassword = req.body.password;
	var confirm_password = req.body.confirm_password;
	if(formPassword != confirm_password){
		res.redirect('/');
	}else{
		var hash = bcrypt.hashSync(formPassword, 10)
		db.run("INSERT INTO users (username, password) VALUES (?,?)", username, hash, function(err){
			if(err) {throw err;}
			console.log('here');
			req.session.valid_user = true;
			res.render(__dirname + '/public/index.html',{user: row.id});
		});
	}
});

app.post('/session', function(req, res) {
  var username = req.body.username;
  var formPassword = req.body.password;
  var password = req.body.password;
  db.get("SELECT * FROM users WHERE username = ?", username, function(err, row) {
          if(err) { throw err; }
          if(row) {
            var passwordMatches = bcrypt.compareSync(password, row.password);
              if(passwordMatches) {
                req.session.valid_user = true;
                req.user = row.username;
                floors = db.all("SELECT * FROM floors WHERE user_id =" + row.id, function(err,fl_row){

                });
                console.log(row.id)
                res.render(__dirname + '/public/index.html',{user: row.id})
              }
              else {
                res.redirect('/');
              }
            } else {
              res.redirect('/');
            }
          });
        });









app.listen(3000);
console.log('Listening on port 3000');