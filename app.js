const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup with file store
app.use(session({
    store: new FileStore({}),
    secret: 'my_secret_key', // Secret key to sign the session ID cookie
    resave: false,           // Do not save session if unmodified
    saveUninitialized: false // Do not create session until something is stored
}));

// Dummy user data (replace with real database in production)
const users = {
    user1: 'password1',
    user2: 'password2'
};

// GET: Show login form
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// POST: Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate login credentials
    if (users[username] && users[username] === password) {
        req.session.username = username; // Save user info to session
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

// GET: Dashboard (requires login)
app.get('/dashboard', (req, res) => {
    if (req.session.username) {
        res.render('dashboard', { username: req.session.username });
    } else {
        res.redirect('/login');
    }
});

// GET: Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
