const express = require('express');
const fs = require('fs').promises;

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/login', async (req, res) => {
    try {
        // Read the JSON file
        const data = await fs.readFile('./users.json', 'utf8');

        // Parse the file contents to a JavaScript object
        const users = JSON.parse(data);

        // Check if the user exists and the password is correct
        const user = users.find(u => u.name === req.body.name && u.password === req.body.password);

        if (user) {
            return res.send('Login successful!');
        } else {
            return res.status(401).send('Invalid username or password.');
        }
    } catch (err) {
        return res.status(500).send('An error occurred reading the users file.');
    }
});

app.get('/admin', )

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));