const express = require('express');
const basicAuth = require('express-basic-auth');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

const app = express();

const users = { 'admin': '$2b$10$...' }; // Replace with hashed password

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

app.use(basicAuth({
    authorizer: async (username, password) => {
        const userExists = users[username] && await bcrypt.compare(password, users[username]);
        return userExists;
    },
    challenge: true
}));

app.get('/admin', (req, res) => {
    res.send('Welcome, admin!');
});

app.listen(3000, () => console.log('Server is running on port 3000'));