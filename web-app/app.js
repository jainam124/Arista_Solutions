const express = require('express');
//const passport = require('passport');
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

const path = require("path");
const router = express.Router();

app.use(express.static("public"))

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + '/register.html'));
    res.send('<img src = "/images/arista_logo.jpg">')
})

//Jainam//
app.use(bodyParser.urlencoded({ extended: false }));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aristasolutions',
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
      connection.release();
      if (err) throw err;
      console.log('User registered');
      res.send('User registered');
    });
  });
});

// //Google Authentication
// passport.use(new GoogleStrategy({
//   clientID: "540931863877-t6smgol2ipk9cehnbune29gq204cee70.apps.googleusercontent.com",
//   clientSecret: "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",
//   callbackURL: "http://localhost:3000/auth/google/callback"
// },
// function(accessToken, refreshToken, profile, done) {
//   // This function will be called when the user is authenticated successfully
//   // You can handle the authentication logic here
// }
// ));
// ////////

// app.get('/', function(req, res){
//   res.send('Hello World!');
// });

// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

//Jainam//

app.listen(3000, () => {
    console.log('Server started on port 3000');
});