const express = require('express');
const jwt = require('jsonwebtoken');
const jsonfile = require('jsonfile');

const app = express();
app.use(express.json());

const SECRET_KEY = 'your-secret-key'; // Replace with your own secret key

app.post('/login', async (req, res) => {
    const users = await jsonfile.readFile('./users.json');
    const user = users.find(u => u.name === req.body.name && u.password === req.body.password);

    if (user) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ message: 'Login successful!', token });
    } else {
        return res.status(401).send('Invalid username or password.');
    }
});

app.get('/dashboard', verifyToken, (req, res) => {
    // If we reach this point, the user is authenticated
    res.send('Welcome to the dashboard!');
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
}

app.listen(3000, () => console.log('Server is running on port 3000'));