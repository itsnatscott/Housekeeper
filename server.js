var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require("sqlite3").verbose();
var cors = require('cors');
var bcrypt = require('bcrypt');
var session = require('express-session')
var secret = require('./secret.json');
var db = new sqlite3.Database("db/housekeeper.db")
var app = express();
var userIdsrv = 1

///point server to where index is
app.use(express.static('public'));
app.engine('html', require('ejs').renderFile);

//set up sessions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: secret.password,
	resave: false,
	saveUninitialized: true
}));

// redirect '/' to login page
app.get('/', function(req,res){
	res.redirect('/housekeepers/login');
});

// display login page
app.get('/housekeepers/login', function(req,res){
  res.sendFile('login.html', { root: __dirname });
});

//send floors json file to backbone
app.get('/housekeepers/floors', function(req,res){
  console.log("trying to get floors")
  if(req.session.valid_user = true){ 
    db.all("SELECT * FROM floors WHERE user_id = ?", session.user_id, function(err,rows){
      if(err){throw err;}
      console.log(session.user_id,rows)
      res.json(rows)
      });
    }else{ res.redirect('/');
  }
});


//render main page after successful login
app.get('/housekeepers',function(req,res){
  console.log(session.user_id)
  if(req.session.valid_user= true){
    ////////setting user id to 1 temporary please fix later
res.render(__dirname + '/public/main.html',{user: userIdsrv});
  }else{res.redirect('/');}
});


//sign up for new user
app.post('/users', function(req,res){
	console.log('new user');
	var username = req.body.username;
	var formPassword = req.body.password;
	var confirm_password = req.body.confirm_password;
	if(formPassword != confirm_password){
		res.redirect('/');
	}else{
		var hash = bcrypt.hashSync(formPassword, 10)
		db.run("INSERT INTO users (username, password) VALUES (?,?)", username, hash, function(err){
			if(err) {
        throw err;
      }
			console.log('new user, successful!');
			req.session.valid_user = true;
      session.user_id = this.lastID
			res.redirect('/housekeepers');
		});
	};
});

//login for current user
app.post('/login', function(req, res) {
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
        session.user_id = row.id
        
      res.redirect('/housekeepers')
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