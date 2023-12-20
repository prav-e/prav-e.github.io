// app.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('./passport'); 
const User = require('./models/user'); 
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/users');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'a9dee35da2736d2a1d56874a9018899fa4c0df4522c12ad1650b47fb0ef195e0',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Home route
app.get('/', (req, res) => {
  const user = req.user;
  if (user) {
    res.redirect('/main');
  } else {
    res.redirect('/login');
  }
});

// Signup route
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/views/signup.html');
});

// Login route
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

// Main page
app.get('/main',(req, res) =>{
  res.sendFile(__dirname + '/views/main.html');
});

// Wasted
app.get('/wasted',(req, res)=>{
  res.sendFile(__dirname + '/views/wasted.html');
});

// Scared
app.get('/scared',(req,res)=>{
  res.sendFile(__dirname + '/views/scared.html');
});

// Sarakku
app.get('/sarakku',(req, res)=>{
  res.sendFile(__dirname + '/views/sarakku.html');
});

// About page
app.get('/aboutpage', (req, res)=>{
  res.sendFile(__dirname + '/views/aboutpage.htm');
});

// Logout page route
app.get('/logout', (req, res) => {
  res.sendFile(__dirname + '/views/logout.html');
});


// Logout route
app.get('/logout', (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
  }
  res.redirect('/logout');
});

// Handle signup form submission
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    console.log(`New user registered: ${username}`); //03-12,22:05
     req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/main');
    });
   } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle login form submission
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Handle login form submission
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log(user);
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed, redirect to login page with a message
      return res.redirect('/login?error=Invalid username or password');
    }
    // Authentication succeeded, log the user in
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      // Redirect to the home page or a welcome page
      return res.redirect('/');
    });
  })(req, res, next);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
