const express = require('express');
const basicAuth = require('express-basic-auth');

const app = express();

app.use(basicAuth({
    users: { 'admin': 'password' }, // Replace 'password' with your real password
    challenge: true
}));

app.get('/admin', (req, res) => {
    res.send('Welcome, admin!');
});

app.listen(3002, () => console.log('Server is running on http://localhost:3002'));