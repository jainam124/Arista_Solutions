const express = require("express");
const session = require("express-session");
//Database Connection
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

const path = require("path");
const router = express.Router();

app.use(express.static("public"))

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
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

//REGISTER
app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
      connection.release();
      if (err) throw err;
      console.log('User registered');
      //res.send('User registered');
      res.redirect('/login.html');
    });
  });
});

// // LOGIN
// app.post('/login', (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     // Query the MySQL database to check if the user's credentials are valid
//     const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
//     pool.query(sql, [username, password], (err, results) => {
//         if (err) throw err;

//         if (results.length > 0) {
//             // If the user's credentials are valid, redirect to the home page
//             res.redirect('/index.html');
            
//         } else {
//             // If the user's credentials are not valid, show an error message
//             res.send(`
//                 <html>
//                     <body>
//                         <h1>Invalid credentials</h1>
//                         <p>Please enter valid credentials to login</p>
//                     </body>
//                 </html>
//             `);
//         }
//     });
// });

/////////
const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');
console.log(secret); // prints a random 64-character string

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
  }));
  
  app.get('/l', (req, res) => {
    if (req.session.loggedIn) {
      res.send('Welcome back, ' + req.session.username + '!');
    } else {
      res.send('You need to log in!');
    }
  });
  
  app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Query the MySQL database to check if the user's credentials are valid
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    pool.query(sql, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // If the user's credentials are valid, redirect to the home page
            req.session.loggedIn = true;
            req.session.username = username;
            res.redirect('/l');
            //res.redirect('/index.html');
            
        } else {
            // If the user's credentials are not valid, show an error message
            res.send(`
                <html>
                    <body>
                        <h1>Invalid credentials</h1>
                        <p>Please enter valid credentials to login</p>
                    </body>
                </html>
            `);
        }
    });
});
    
    // // Check if username and password are correct (replace with your own authentication logic)
    // if (username === 'myusername' && password === 'mypassword') {
    //   req.session.loggedIn = true;
    //   req.session.username = username;
    //   res.redirect('/l');
    // } else {
    //   res.send('Incorrect username or password!');
    // }
  

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
