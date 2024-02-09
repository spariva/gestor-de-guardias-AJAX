const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const session = require('express-session');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if your app is on https
}));

app.post('/login', async (req, res) => {
    try {
        const data = await fs.readFile('./users.json', 'utf8');
        const users = JSON.parse(data);
        const user = users.find(u => u.name === req.body.name && u.password === req.body.password);

        if (user) {
            req.session.user = user; // Save user in session
            return res.redirect('/dashboard.html');
        } else {
            return res.status(401).send('Invalid username or password.');
        }
    } catch (err) {
        return res.status(500).send('An error occurred reading the users file.');
    }
});

app.get('/dashboard.html', (req, res) => {
    if (req.session && req.session.user) { // Check if user is logged in
        res.sendFile('/path/to/your/dashboard.html');
    } else {
        res.redirect('/login.html'); // Redirect to login if not logged in
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));