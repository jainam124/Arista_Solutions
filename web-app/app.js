const express = require("express");
const app = express();
const session = require('express-session');
const router = express.Router();
const mysql = require("mysql")

// 8.0.32-0ubuntu0.22.04.2












// ----------------------------------------------------------------------------------- //
// //Register
// app.post('/register', (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   pool.getConnection((err, connection) => {
//     if (err) throw err;
//     connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
//       connection.release();
//       if (err) throw err;
//       console.log('User registered');
//       res.send('User registered');
//     });
//   });
// });


// ----------------------------------------------------------------------------------- //
app.use(express.static("public"))
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
    res.send('<img src = "/images/arista_logo.jpg">')
})

app.use('/', router);
app.listen(process.env.port || 3000);

console.log("Application running on port 3000");
