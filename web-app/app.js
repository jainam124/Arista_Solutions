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

    // Check if the username already exists in the database
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
      if (err) {
        connection.release();
        throw err;
      }

      if (rows.length > 0) {
        // Username already exists, send alert message
        res.send(`
          <script>
            alert('Email already registered');
            setTimeout(function() {
              window.location.href = 'login.html';
            }, 50); // Set a delay of 5 seconds before redirecting
          </script>
        `);
      } else {
        // Insert the new user into the database
        connection.query('INSERT INTO users (name, phone, username, password) VALUES (?, ?, ?, ?)', [name, phone, username, password], (err, result) => {
          connection.release();
          if (err) throw err;
          console.log('User registered');
          //res.send('User registered');
          res.redirect('/login.html');
        });
      }
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
    req.session.loggedIn = true;
    req.session.username = username;
    // res.send(`
    //   <html>
    //     alert('Welcome ${username}!');
    //     setTimeout(function() {
    //       window.location.href = 'index.html';
    //     }, 50); // Set a delay of 5 seconds before redirecting
    //   </html>
    // `);
    res.redirect('/dashboard');


  } else {
    // Query the MySQL database to check if the user's credentials are valid
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    pool.query(sql, [username, password], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        // If the user's credentials are valid, set the session variables and redirect to the home page
        req.session.loggedIn = true;
        req.session.username = username;
        res.send(`
          <script>
            alert('Welcome ${username}!');
            setTimeout(function() {
              window.location.href = 'index.html';
            }, 50); // Set a delay of 5 seconds before redirecting
          </script>
        `);
      } else {
        // If the user's credentials are not valid, show an error message
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


//DASHBOARD
app.get('/dashboard', (req, res) => {
  pool.query('SELECT COUNT(*) as total_users FROM users;', (error, results) => {
    if (error) {
      console.error('Error counting users:', error);
      res.status(500).send('Error counting users');
    } else {
      const totalUsers = results[0].total_users;
      //res.status(200).json({ totalUsers });
      pool.query('SELECT COUNT(*) AS total_products FROM products;', (error, results) => {
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

//CONTACT
app.post('/contact', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  pool.getConnection((err, connection) => {
    if (err) throw err; 
        // Insert the new user into the database
        connection.query('INSERT INTO contact (name, email, message) VALUES (?, ?, ?)', [name, email, message], (err, result) => {
          connection.release();
          if (err) throw err;
          console.log('Feedback received');
          //res.send('User registered');
          res.redirect('/contact.html');
        });
    });
  });


//ADMIN-MANAGE USERS
// Route to display the user list
app.get('/admin_contact', (req, res) => {
  // Fetch users from the database
  pool.query('SELECT * FROM contact', (error, results) => {
    if (error) throw error;
    res.render('admin_contact', { contact: results });
  });
});

// Route to handle delete request
app.post('/delete/:email', (req, res) => {
  const email = req.params.email;

  // Display confirmation dialog using JavaScript's alert
  const confirmation = `
    <script>
      var confirmed = confirm("Are you sure you want to delete the user?");
      if (confirmed) {
        window.location.href = "/delete/confirmed/${email}";
      } else {
        window.location.href = "/";
      }
    </script>
  `;

  res.send(confirmation);
});

// Route to handle confirmed delete request
app.get('/delete/confirmed/:username', (req, res) => {
  const email = req.params.email;

  // Delete the user from the database
  pool.query('DELETE FROM users WHERE email = ?', [email], (error, result) => {
    if (error) throw error;
    res.redirect('/admin_contact');
  });
});

//NEWSLETTER
app.post('/newsletter', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  pool.getConnection((err, connection) => {
    if (err) throw err; 
        // Insert the new user into the database
        connection.query('INSERT INTO newsletter (email) VALUES (?)', [email], (err, result) => {
          connection.release();
          if (err) throw err;
          console.log('Newsletter subscribed');
          //res.send('User registered');
          res.redirect('/index.html');
        });
    });
  });

app.listen(3000, () => {
    console.log('Server started on port 3000');    
});
