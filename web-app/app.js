const express = require("express");
const session = require("express-session");
//Database Connection
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

const path = require("path");
const router = express.Router();

//Pdf Upload
const multer = require('multer');
const fs = require('fs');

const bcrypt = require('bcrypt');

//middleware for serving static file
app.use(express.static("public"))

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
    res.send('<img src = "/images/arista_logo.jpg">')
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aristasolutions',
});

//REGISTER


app.post('/register', (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const username = req.body.username;
  const password = req.body.password;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query('INSERT INTO users (name, phone, username, password) VALUES (?, ?, ?, ?)', [name, phone, username, password], (err, result) => {
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
    //window.alert("Welcome");
  } else {
    res.send('You need to log in!');
  }
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === 'admin' && password === 'admin1234') {
    // If the username and password match, set the session variables and redirect to the home page
    req.session.isLoggedIn = true;
    req.session.username = username;
    // res.send(`
    //   <html>
    //     alert('Welcome ${username}!');
    //     setTimeout(function() {
    //       window.location.href = 'index.html';
    //     }, 50); // Set a delay of 5 seconds before redirecting
    //   </html>
    // `);
    res.redirect('/pdf.html');


  } else {
    // Query the MySQL database to check if the user's credentials are valid
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    pool.query(sql, [username, password], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        // If the user's credentials are valid, set the session variables and redirect to the home page
        req.session.isLoggedIn = true;
        req.session.username = username;
       /* res.send(`
          <!--<script>
            alert('Welcome ${username}!');
            setTimeout(function() {
              window.location.href = 'index.html';
            }, 50); // Set a delay of 5 seconds before redirecting
          </script>-->


        `);*/
      } else {
        // If the user's credentials are not valid, show an error message
        req.session.isLoggedIn = false;
        res.send(`
          <html>
            <body>
              <h1>Invalid credentials</h1>
              <p>Please enter valid credentials to log in</p>
            </body>
          </html>
        `);
      }

    });
  }
  const condition = req.session.isLoggedIn; // Replace with your own condition

  // Generate the HTML based on the condition
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="style.css">
      <link rel="icon" type="image/x-icon" href="images/arista_logo.jpg">
  
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Alkatra&family=Golos+Text&display=swap" rel="stylesheet">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=PT+Serif&display=swap" rel="stylesheet">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Oswald&display=swap" rel="stylesheet">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.4/flowbite.min.css" rel="stylesheet" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.4/flowbite.min.js"></script>  
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet">
     
      <title>Arista Solutions</title>
  
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      
  </head>
  <body>
  
      <!------------------------------------------------------------------- Navbar starts --------------------------------------------------------------- -->
      <div class="container mx-auto p-5">
        <div class="md:flex md:flex-row md:justify-between text-center text-sm sm:text-base">
          <div class="flex flex-row justify-center">
            <div class="rounded-lg">
                <a href="index.html">
                    <img
                      class="mx-auto w-48 hover:shadow-lg transition duration-300 ease-in-out"
                      src="images/arista_logo.jpg"
                      alt="logo"
                    />
                </a>
            </div>
            <a href="index.html">
                <h1 class="text-3xl hover:text-red-600 text-gray-600 mt-12 ml-14 hover:shadow-lg transition duration-300 ease-in-out">Arista Solutions</h1>
            </a>        
          </div>
      
          <div class="mt-14">
            <a href="index.html" class="text-red-600 p-4 px-3 sm:px-7 shadow-lg transition duration-300 ease-in-out">Home</a>      
            <a href="/view_product" class="text-gray-600 hover:text-red-600 p-4 px-3 sm:px-5 hover:shadow-lg transition duration-300 ease-in-out">Products</a>
            <a href="/about" class="text-gray-600 hover:text-red-600 p-4 px-3 sm:px-5 hover:shadow-lg transition duration-300 ease-in-out">About us</a>         
            <a href="contact.html" class="text-gray-600 hover:text-red-600 p-4 px-3 sm:px-5 hover:shadow-lg transition duration-300 ease-in-out">Contact us</a>          
            <!-- <a href="login.html" class="ml-5">
              <button class="btn btn-danger" type="">Login</button>
            </a>           -->
            <a href="login.html" class="mx-10">
              ${condition ? '<button class="hover:bg-red-500 bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-red-700 rounded-2xl">Login</button>' : '<button class="hover:bg-red-500 bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-red-700 rounded-2xl">Logout</button>'}
           </a>
          </div>
        </div>   
      </div>
        <!------------------------------------------------------------------- Navbar ends --------------------------------------------------------------- -->
      
  
  
        <!------------------------------------------------------------------- Carousel starts --------------------------------------------------------------- -->
        <div id="myCarousel" class="mx-2 my-2 carousel slide" data-bs-ride="carousel">
          <!-- Carousel indicators -->
          <ol class="carousel-indicators">
              <li data-bs-target="#myCarousel" data-bs-slide-to="0" class="active"></li>
              <li data-bs-target="#myCarousel" data-bs-slide-to="1"></li>
              <li data-bs-target="#myCarousel" data-bs-slide-to="2"></li>
          </ol>
      
          <!-- Wrapper for carousel items -->
          <div class="carousel-inner">
              <div class="carousel-item active" style = "border-radius: 65px;">
                  <img src="images/slider1.jpg" class="mx-auto" alt="Slide 1">
              </div>
              <div class="carousel-item" style = "border-radius: 65px;">
                  <img src="images/slider2.jpg" class="mx-auto" alt="Slide 2">
              </div>
              <div class="carousel-item" style = "margin-bottom: 30px; border-radius: 65px;">
                  <img src="images/slider3.png" class="mx-auto" alt="Slide 3">
              </div>
          </div>
      
          <!-- Carousel controls -->
          <a class="carousel-control-prev" href="#myCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
          </a>
          <a class="carousel-control-next" href="#myCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
          </a>
      </div>
  <!------------------------------------------------------------------- Carousel ends --------------------------------------------------------------- -->
  
  
  
  <!------------------------------------------------------------------- Info starts --------------------------------------------------------------- -->
      <div class="container my-32">
        <h3 style="font-size: 40px; font-family: 'Alkatra', cursive;">We are Arista Solutions 
          <br> and we distribute <span style="text-decoration: underline;">Fire safety and Security Equipments</span></h3>
  
        <p class="my-7" style = "width: 850px; font-size: 22px; font-family: 'PT Serif', serif;">We are one of the largest leading distributor and supplier of Fire Fighting &<br>Rescue Equipments 
           in INDIA since 2 decades and our product serving to more <br> than 10 countries worldwide.
           <br><br>
           Arista Solutions Pvt. Ltd. offers a comprehensive range of top quality
           firefighting equipment's & products. Arista Solutions is a widely acclaimed brand <br> name in both 
           National & International markets due to the product quality, services and customer 
           oriented approach. Our products & systems are approved by accredited national & 
           international agencies such as ISI, UL, FM, Vds, LPCB, GL etc. <br> <br> 
           The group austerely adheres to national as well as global standards like <br> 
           BIS, EN, NFPA etc.</p>
  
           <a href="about.html">
              <button class="my-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-blue-700 rounded-full">
                Read More!
              </button>
           </a>
  
        <img class="" style="margin-top: -560px; margin-left: 950px;" src="images/fire_prevention.gif" alt="Fire Prevention">
      </div>
  <!------------------------------------------------------------------- Info ends --------------------------------------------------------------- -->
  
  
  
  <!------------------------------------------------------------------- Our Products starts --------------------------------------------------------------- -->
  <div class="container my-48">
    <center style="font-size: 40px; font-family: 'Oswald', sans-serif;" class="my-3">OUR PRODUCTS</center>
    <center style="color: red; font-size: 20px;">product range</center>
  
    <div class="my-10">
      <center><img src="images/our_products.png" alt="Our Products"></center>
    </div>
    
  </div>
  <!------------------------------------------------------------------- Our Products ends --------------------------------------------------------------- -->
  
  
  
  <!------------------------------------------------------------------- Latest news starts --------------------------------------------------------------- -->
  <div style="margin-top: -45px;" class="container my-14">
    <center style="font-size: 40px; font-family: 'Oswald', sans-serif;" class="">LATEST NEWS</center>
    <center style="color: red; font-size: 20px;" >stay updated with arista solutions</center>
  </div>
  
  <div class="container" style="margin-top: 25px;">
  
    <div class="container">
      <img src="images/news_1.jpg" alt="About the image" width="425px" style="margin-left: 70px; font-family: 'Alkatra', cursive;">
     
      <h4 style = "font-size: 22px; 
                   margin-left: 85px; 
                   margin-top: 35px; 
                   margin-bottom: 10px;
                   width: 405px;">
                   Fire protection of Industrial Application</h4>
  
      <p style = "margin-top: 35px; margin-left: 75px; font-size: 17px; width: 405px;">Rotating or other machinery is operated in virtually <br> every industrial facility. The machinery can consist of <br> wide range  of equipment: from diesel engines <br> to transformers.</p>
    </div>
  
    <div class="container">
      <img src="images/news_2.jpg" alt="About the image" width="425px" style="margin-top: -517px; margin-left: 535px;">
      <h4 style = "font-size: 22px; 
                   margin-left: 545px; 
                   margin-top: 35px; 
                   margin-bottom: 10px;
                   width: 405px;">
                   Fire protection of Road and Rail Tunnels</h4>
  
      <p style = "margin-top: 35px; margin-left: 545px; font-size: 17px; width: 405px;">Fires inside long tunnels are rare but can be catastrophic. Intervention by the fire brigade is difficult due to access problems. Heat and smoke make fire-fighting operations dangerous and slow.</p>
    </div>
    
    <div class="container">
      <img src="images/news_3.jpg" alt="About the image" width="425px" style="margin-top: -517px; margin-left: 1000px;">
      
      <h4 style = "font-size: 22px; 
                   margin-left: 1015px; 
                   margin-top: 35px; 
                   margin-bottom: 10px;
                   width: 405px;">
                   Fire protection for Manufacturing Units</h4>
  
      <p style = "margin-top: 35px; margin-left: 1015px; font-size: 17px; width: 405px;">Fire protection for manufacturing units involves measures to prevent, detect, and suppress fires, including fire-resistant building construction, fire alarms and detection systems, fire suppression systems, employee training, and hazard management.</p>
    </div>
  </div>
  <!------------------------------------------------------------------- Latest news ends --------------------------------------------------------------- -->
  
  
  
  <!------------------------------------------------------------------- Footer starts --------------------------------------------------------------- -->
  <footer class="px-4 divide-y dark:bg-gray-800 dark:text-gray-100" style="margin-top: 35px; background-color: #E21818;">
    <div class="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
      <div class="lg:w-1/3">
        <a rel="noopener noreferrer" href="#" class="flex justify-center space-x-3 lg:justify-start">
          <div class="flex items-center justify-center w-44 h-12 rounded-full dark:bg-violet-400">
            <img style="margin-top: 35px;" src="images/arista_logo.jpg" alt="">					
          </div>
        
          <span style="margin-top: 23px; margin-left: 35px; color: aliceblue;" class="self-center text-2xl font-semibold">Arista Solutions</span>
        </a>
      </div>
      <div class="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4">
  
        <div class="space-y-3" style="color: aliceblue;">
          <h3 class="tracking-wide uppercase dark:text-gray-50" style="font-size: larger;">Our Products</h3>
          <ul class="space-y-1">
            <li>
              <a rel="noopener noreferrer" href="products.html">Features</a>
            </li>
            <li>
              <a rel="noopener noreferrer" href="products.html">Pricing</a>
            </li>
            <li>
              <a rel="noopener noreferrer" href="#">Catalogues</a>
            </li>				
          </ul>
        </div>
        
        <div class="space-y-3" style="color: aliceblue;">
          <h3 class="tracking-wide uppercase dark:text-gray-50" style="font-size: larger;">Company</h3>
          <ul class="space-y-1">
            <li>
              <a rel="noopener noreferrer" href="about.html">About us</a>
            </li>
            <li>
              <a rel="noopener noreferrer" href="about.html">Terms of Service</a>
            </li>
          </ul>
        </div>
        
        <div class="space-y-3" style="color: aliceblue;">
          <h3 class="uppercase dark:text-gray-50" style="font-size: larger;">Contact us</h3>
          <ul class="space-y-1">
            <li>
              <a rel="noopener noreferrer" href="contact.html">Feedback</a>
            </li>
            <li>
              <a rel="noopener noreferrer" href="contact.html">E-mail us</a>
            </li>					
          </ul>
        </div>
  
        <div class="space-y-3">
          <div class="uppercase dark:text-gray-50" style="color: aliceblue;">Social media</div>
          <div class="flex justify-start space-x-3" style="color: aliceblue;">
            <a rel="noopener noreferrer" href="https://www.facebook.com/" title="Facebook" class="flex items-center p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
                <path d="M32 16c0-8.839-7.167-16-16-16-8.839 0-16 7.161-16 16 0 7.984 5.849 14.604 13.5 15.803v-11.177h-4.063v-4.625h4.063v-3.527c0-4.009 2.385-6.223 6.041-6.223 1.751 0 3.584 0.312 3.584 0.312v3.937h-2.021c-1.984 0-2.604 1.235-2.604 2.5v3h4.437l-0.713 4.625h-3.724v11.177c7.645-1.199 13.5-7.819 13.5-15.803z"></path>
              </svg>
            </a>
            <a rel="noopener noreferrer" href="https://twitter.com" title="Twitter" class="flex items-center p-1">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current">
                <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"></path>
              </svg>
            </a>
            <a rel="noopener noreferrer" href="https://instagram.com" title="Instagram" class="flex items-center p-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" class="w-5 h-5 fill-current">
                <path d="M16 0c-4.349 0-4.891 0.021-6.593 0.093-1.709 0.084-2.865 0.349-3.885 0.745-1.052 0.412-1.948 0.959-2.833 1.849-0.891 0.885-1.443 1.781-1.849 2.833-0.396 1.020-0.661 2.176-0.745 3.885-0.077 1.703-0.093 2.244-0.093 6.593s0.021 4.891 0.093 6.593c0.084 1.704 0.349 2.865 0.745 3.885 0.412 1.052 0.959 1.948 1.849 2.833 0.885 0.891 1.781 1.443 2.833 1.849 1.020 0.391 2.181 0.661 3.885 0.745 1.703 0.077 2.244 0.093 6.593 0.093s4.891-0.021 6.593-0.093c1.704-0.084 2.865-0.355 3.885-0.745 1.052-0.412 1.948-0.959 2.833-1.849 0.891-0.885 1.443-1.776 1.849-2.833 0.391-1.020 0.661-2.181 0.745-3.885 0.077-1.703 0.093-2.244 0.093-6.593s-0.021-4.891-0.093-6.593c-0.084-1.704-0.355-2.871-0.745-3.885-0.412-1.052-0.959-1.948-1.849-2.833-0.885-0.891-1.776-1.443-2.833-1.849-1.020-0.396-2.181-0.661-3.885-0.745-1.703-0.077-2.244-0.093-6.593-0.093zM16 2.88c4.271 0 4.781 0.021 6.469 0.093 1.557 0.073 2.405 0.333 2.968 0.553 0.751 0.291 1.276 0.635 1.844 1.197 0.557 0.557 0.901 1.088 1.192 1.839 0.22 0.563 0.48 1.411 0.553 2.968 0.072 1.688 0.093 2.199 0.093 6.469s-0.021 4.781-0.099 6.469c-0.084 1.557-0.344 2.405-0.563 2.968-0.303 0.751-0.641 1.276-1.199 1.844-0.563 0.557-1.099 0.901-1.844 1.192-0.556 0.22-1.416 0.48-2.979 0.553-1.697 0.072-2.197 0.093-6.479 0.093s-4.781-0.021-6.48-0.099c-1.557-0.084-2.416-0.344-2.979-0.563-0.76-0.303-1.281-0.641-1.839-1.199-0.563-0.563-0.921-1.099-1.197-1.844-0.224-0.556-0.48-1.416-0.563-2.979-0.057-1.677-0.084-2.197-0.084-6.459 0-4.26 0.027-4.781 0.084-6.479 0.083-1.563 0.339-2.421 0.563-2.979 0.276-0.761 0.635-1.281 1.197-1.844 0.557-0.557 1.079-0.917 1.839-1.199 0.563-0.219 1.401-0.479 2.964-0.557 1.697-0.061 2.197-0.083 6.473-0.083zM16 7.787c-4.541 0-8.213 3.677-8.213 8.213 0 4.541 3.677 8.213 8.213 8.213 4.541 0 8.213-3.677 8.213-8.213 0-4.541-3.677-8.213-8.213-8.213zM16 21.333c-2.948 0-5.333-2.385-5.333-5.333s2.385-5.333 5.333-5.333c2.948 0 5.333 2.385 5.333 5.333s-2.385 5.333-5.333 5.333zM26.464 7.459c0 1.063-0.865 1.921-1.923 1.921-1.063 0-1.921-0.859-1.921-1.921 0-1.057 0.864-1.917 1.921-1.917s1.923 0.86 1.923 1.917z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="py-6 text-sm text-center dark:text-gray-400" style="color: aliceblue;">© 2020 Arista Solutions. <br> All rights reserved.</div>
  </footer>
  <!------------------------------------------------------------------- Footer ends --------------------------------------------------------------- -->
  
  </body>
  </html>
  `;
  res.send(html);
});
    
    // // Check if username and password are correct (replace with your own authentication logic)
    // if (username === 'myusername' && password === 'mypassword') {
    //   req.session.loggedIn = true;
    //   req.session.username = username;
    //   res.redirect('/l');
    // } else {
    //   res.send('Incorrect username or password!');
    // }
  
//PDF Upload
const upload = multer({ dest: 'uploads/' });

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.post('/about', upload.single('pdf'), (req, res) => {
  const { originalname, mimetype, filename } = req.file;
  const sql = 'INSERT INTO pdfs (name, mimetype, file) VALUES (?, ?, ?)';

  pool.query(sql, [originalname, mimetype, filename], (err, result) => {
    if (err) throw err;
    console.log('PDF uploaded successfully!');
    res.redirect('/about');
  });
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/about', (req, res) => {
  const sql = 'SELECT * FROM pdfs';

  pool.query(sql, (err, results) => {
    if (err) throw err;
    res.render('about', { pdfs: results });
  });
});

app.get('/pdf/:id', (req, res) => {
  const sql = 'SELECT * FROM pdfs WHERE id = ?';

  pool.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;

    const pdfPath = path.join(__dirname, 'uploads', result[0].file);
    res.download(pdfPath, result[0].name);
  });
});

//ADD PRODUCT - ADMIN SIDE
// configure multer to handle image uploads
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images");
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    const name = path.basename(file.originalname, extension);
    callback(null, `${name}-${Date.now()}${extension}`);
  },
});

const upload2 = multer({ storage: storage });

// use body-parser middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// handle form submission
app.post("/addProduct", upload2.single("image"), (req, res) => {
  // extract product data from request body
  const { name, price, description } = req.body;
  const image = req.file;

  // convert image to blob format
  const imageData = fs.readFileSync(image.path);
  const imageBlob = Buffer.from(imageData);

  // insert product data into database
  pool.query(
    "INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)",
    [name, price, description, imageBlob],
    (error, results, fields) => {
      if (error) throw error;
      res.redirect("view_product");
    }
  );
});

//PRODUCT DISPLAY - Client SIDE
// retrieve product data from the database
const getProducts = (callback) => {
  pool.query("SELECT * FROM products", (error, results, fields) => {
    if (error) throw error;
    callback(results);
  });
};

// set the view engine to ejs
app.set('view engine', 'ejs');

// serve the HTML page with product data
app.get("/view_product", (req, res) => {
  getProducts((products) => {
    res.render("view_product", {
      products: products,
    });
  });
});

// serve the product images
app.get("/image/:id", (req, res) => {
  const id = req.params.id;
  pool.query(
    "SELECT image FROM products WHERE id = ?",
    [id],
    (error, results, fields) => {
      if (error) throw error;
      const imageBlob = results[0].image;
      res.writeHead(200, {
        "Content-Type": "image/jpeg",
        "Content-Length": imageBlob.length,
      });
      res.end(imageBlob);
    }
  );
});

//-----------------------------------------------------ADD-TO-CART-----------------------------------------------------
/*app.get("/cart", (request, response) => {

	const query = `SELECT * FROM products`;

	//Execute Query
	pool.query(query, (error, result) => {

		response.render('cart', { products : result, cart : request.session.cart });

	});

});*/
app.get("/cart", (request, response) => {
	const query = `SELECT * FROM product`;
	//Execute Query
	pool.query(query, (error, result) => {
		if(!request.session.cart)
		{
			request.session.cart = [];
		}
		response.render('cart', { products : result, cart : request.session.cart });
	});
});

//Create Route for Add Item into Cart
app.post('/add_cart', (request, response) => {

	const id = request.body.id;
	const name = request.body.name;
	const price = request.body.price;
	let count = 0;
  if (!request.session.cart) {
    request.session.cart = [];
  }
	for(let i = 0; i < request.session.cart.length; i++)
	{
		if(request.session.cart[i].id === id)
		{
			request.session.cart[i].quantity += 1;
			count++;
		}
	}
	if(count === 0)
	{
		const cart_data = {
			id : id,
			name : name,
			price : parseFloat(price),
			quantity : 1
		};
		request.session.cart.push(cart_data);
	}
	response.redirect("/view_product");
});

//Create Route for Remove Item from Shopping Cart
app.get('/remove_item', (request, response) => {
	const id = request.query.id;
	for(let i = 0; i < request.session.cart.length; i++)
	{
		if(request.session.cart[i].id === id)
		{
			request.session.cart.splice(i, 1);
		}
	}
	response.redirect("/cart");
});



// Define a route for storing the order in the database
app.post('/submit-order', (req, res) => {
  const { itemName, quantity, unitPrice, totalPrice } = req.body;

  // Create an SQL query to insert the order into the 'orders' table
  const sql = 'INSERT INTO orders (itemName, quantity, unitPrice, totalPrice) VALUES (?, ?, ?, ?)';
  const values = [itemName, quantity, unitPrice, totalPrice];

  // Execute the SQL query
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error storing the order: ', err);
      res.status(500).send('Error storing the order');
      return;
    }

    console.log('Order stored successfully!');
    res.status(200).send('Order stored successfully');
  });
});

//ADMIN-MANAGE USERS
// Route to display the user list
app.get('/users', (req, res) => {
  // Fetch users from the database
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) throw error;
    res.render('users', { users: results });
  });
});

// Route to handle delete request
app.post('/delete/:username', (req, res) => {
  const username = req.params.username;

  // Display confirmation dialog using JavaScript's alert
  const confirmation = `
    <script>
      var confirmed = confirm("Are you sure you want to delete the user?");
      if (confirmed) {
        window.location.href = "/delete/confirmed/${username}";
      } else {
        window.location.href = "/";
      }
    </script>
  `;

  res.send(confirmation);
});

// Route to handle confirmed delete request
app.get('/delete/confirmed/:username', (req, res) => {
  const username = req.params.username;

  // Delete the user from the database
  pool.query('DELETE FROM users WHERE username = ?', [username], (error, result) => {
    if (error) throw error;
    res.redirect('/users');
  });
});


app.get('/dashboard', (req, res) => {
  pool.query('SELECT COUNT(id) AS total_users FROM users;', (error, results) => {
    if (error) {
      console.error('Error counting users:', error);
      res.status(500).send('Error counting users');
    } else {
      const totalUsers = results[0].total_users;
      //res.status(200).json({ totalUsers });
      pool.query('SELECT COUNT(id) AS total_products FROM products;', (error, results) => {
        if (error) {
          console.error('Error counting products:', error);
          res.status(500).send('Error counting products');
        } else {
          const totalProducts = results[0].total_products;
          //res.status(200).json({ totalProducts });
          res.render("dashboard",{totalUsers,totalProducts});
        }
      });
    }
  });
});

/*app.get('/index', (req, res) => {
  res.send(html);
});*/

//${condition ? '<p>The condition is true!</button>' : '<p>The condition is false!</p>'}
/*app.get('/index', (req, res) => {
  // Get the logged-in state from your authentication logic
  const loggedIn = req.session.loggedIn || false;

  // Read the index.html file
  let html = fs.readFileSync(__dirname + '/index.html', 'utf8');

  // Replace the placeholder with the login/logout button
  const loginButton = loggedIn ? '<a href="/logout">Logout</a>' : '<a href="/login">Login</a>';
  html = html.replace('<!-- The login/logout button will be dynamically inserted here -->', loginButton);

  // Send the modified HTML as the response
  res.send(html);
});*/

app.listen(3000, () => {
    console.log('Server started on port 3000');    
});
