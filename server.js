var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require("sqlite3").verbose();
var cors = require('cors');
var bcrypt = require('bcrypt');
var session = require('express-session')
var secret = require('./secret.json');
var db = new sqlite3.Database("db/housekeeper.db")
var app = express();
var colourlovers = require('colourlovers');
var request = require('request');
var userIdsrv = 1

///point server to where index is
app.use(express.static('public'));
app.engine('html', require('ejs').renderFile);

//set up sessions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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

//get floors based on user id
app.get('/housekeepers/floors', function(req,res){
  console.log("trying to get floors")
  if(req.session.valid_user = true){ 
    db.all("SELECT * FROM floors WHERE user_id = ?", session.user_id, function(err,rows){
      if(err){throw err;}
      res.json(rows)
    });
  }else{ res.redirect('/');
}
});
//get rooms based on floor id
app.get('/housekeepers/floors/:flId/rooms', function(req,res){
  console.log("trying to get rooms")
  if(req.session.valid_user = true){
    db.all("SELECT * FROM rooms WHERE floor_id = ?", req.params.flId, function(err,rows){
      if(err){throw err;}
      res.json(rows)
    });
  }else{ res.redirect('/');
}
});

//get new colors for rooms from colorlovers api
//get new colors for rooms from colorlovers api
app.post('/housekeepers/floors/:flId/rooms/:rmId', function(req,res){
  console.log(req.body)
  colourlovers.get('/palettes', req.body,function(err, data) {
    if(err) throw err;
    console.log(data)
  //   if(data[0] === undefined){console.log("nothing there")
  // }else{console.log("something there")}


  if(data[0] != undefined){
    newPalette = data[0].colors;
    if(newPalette[2] === null){
      newPalette[2] = req.body.hex
    }
    db.run("UPDATE rooms SET color_1 = ?, color_2 = ?, color_3 = ? WHERE id = ?", newPalette[0], newPalette[1], newPalette[2], req.params.rmId, function(err){
      if(err){throw err;}
      var id = this.lastId;
      db.get("SELECT * FROM rooms WHERE id = ?", id, function(err,row){
        if(err){
          throw err;
        }
        res.json(row);
      });
    });

    //plan B if the query had no response
  }else{ 
    console.log("plan B")
    request('http://www.colourlovers.com/api/patterns/top?format=json', function(error, response, body) {
      var planB = JSON.parse(body);
      var numb = Math.floor((Math.random() * planB.length) + 1);
      planBPalette = planB[numb].colors
      db.run("UPDATE rooms SET color_1 = ?, color_2 = ?, color_3 = ? WHERE id = ?", planBPalette[0], planBPalette[1], planBPalette[2], req.params.rmId, function(err){
        if(err){throw err;}
        var id = this.lastId;
        db.get("SELECT * FROM rooms WHERE id = ?", id, function(err,row){
          if (err){
            throw err;
          }
          res.json(row)
        });
      });

    });
  }
});
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

app.post('/housekeepers/floors', function(req,res){
  console.log("adding floor for uID:"+session.user_id)
  if(req.session.valid_user = true) {
    db.run("INSERT INTO floors (user_id, fl_pic, fl_name) VALUES (?,?,?)", req.body.user_id, req.body.fl_pic, req.body.fl_name, function(err){
      if(err){
        throw err;
      }
      var id = this.lastID;
      db.get("SELECT * FROM floors WHERE id = ?", id, function(err, row){
        if(err) {
          throw err;
        }
        res.json(row);
      });
    });
  } else {
    res.redirect('/')
  }
});

app.delete('/housekeepers/floors/:id', function(req,res){
  console.log("deleting a floor")
  db.get("SELECT * FROM floors WHERE id =?", req.params.id, function(err){
    if(err){
      throw err;
    }
    res.json({deleted: true});
  });
});

app.post('/housekeepers/floors/:id/rooms', function(req,res){
  console.log("adding room for flId:"+req.params.id)
  if(req.session.valid_user = true) {
    db.run("INSERT INTO rooms (floor_id, roomname, color_1, color_2, color_3, rmPic) VALUES (?,?,?,?,?,?)", req.body.floor_id, req.body.roomname, req.body.color_1, req.body.color_2, req.body.color_3, req.body.rmPic, function(err){
      if(err){
        throw err;
      }
      var id = this.lastID;
      db.get("SELECT * FROM rooms WHERE id = ?", id, function(err, row){
        if(err) {
          throw err;
        }
        res.json(row);
      });
    });
  } else {
    res.redirect('/')
  }
});



app.listen(3000);
console.log('Listening on port 3000');