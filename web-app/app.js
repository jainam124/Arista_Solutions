const express = require("express");
const app = express();

const path = require("path");
const router = express.Router();

app.use(express.static("public"))

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
    res.send('<img src = "/images/arista_logo.jpg">')
})

app.use('/', router);
app.listen(process.env.port || 8000);

console.log("Application running on port 8000");
