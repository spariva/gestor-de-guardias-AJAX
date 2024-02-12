//Paths:
const path = require('path');
const basePath = path.resolve(__dirname, '.');
const publicPath = path.join(basePath, 'public');
// const adminPath = path.join(basePath, 'public/admin.html');
// const teacherPath = path.join(basePath, 'public/teacher.html');
// const loginPath = path.join(basePath, 'public/login.html');
const envPath = path.join(basePath, '.env');
//Dotenv:
require('dotenv').config({ path: envPath });
//Express:
const express = require('express');
const fs = require('fs').promises;
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'secret'; // Replace with your own secret key
const createError = require('http-errors'); // error handling
const cookieParser = require('cookie-parser'); // parse cookies
const logger = require('morgan'); // log requests
// const bcrypt = require('bcryptjs'); encrypt passwords
const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator'); validate user input

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
// Finally I don´t use routers...
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

const app = express();

// view engine setup. not using rn.
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(publicPath));

app.use(express.json());

//*Login:
app.get('/', function (req, res) {
    res.sendFile(path.join(publicPath, 'login.html'));
});

app.post('/login2', async (req, res) => {
    const { name, password } = req.body;
    let users = await fs.readFile('./jsonFiles/users.json');
    users = JSON.parse(users);
    const user = users.find(u => u.name === name && u.password === password);
    console.log(user);
    console.log(req.body.name);
    if (user) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ message: 'Login successful!', token });
    } else {
        return res.status(401).send('Invalid username or password.');
    }
});

app.get('/admin', (req, res) => {
    // If we reach this point, the user is authenticated
    fs.readFile('./jsonFiles/guardias.json', (err, data) => {
        if (err) throw err;
        let guardias = [];
        if (data.toString()) {
            guardias = JSON.parse(data);
        }
        res.send(guardias);
    });
    res.redirect('/admin.html');
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send('A token is required for authentication');
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
}

app.get('/teacher', (req, res) => {
    res.sendFile(path.join(publicPath, 'teacher.html'));
});



//*Error handling:
// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

//*CRUD:
// let guardias = [];

//get use await and async
app.get('/guardias', async (req, res) => {
    const guardias = JSON.parse(await fs.readFile('./jsonFiles/guardias.json', 'utf8'));
    res.json(guardias);
});

app.post('/guardias', (req, res) => {
    fs.readFile('./jsonFiles/./jsonFiles/guardias.json', (err, data) => {
        if (err) throw err;
        let guardias = [];
        if (data.toString()) {
            guardias = JSON.parse(data);
        }

        guardias.sort((a, b) => {
            if (a.day < b.day) return -1;
            if (a.day > b.day) return 1;

            if (a.time < b.time) return -1;
            if (a.time > b.time) return 1;
            return 0;
        });

        res.status(200).send(guardias);
    });
});

//post use await and async
app.post('/addGuardia', async (req, res) => {
    const guardia = {
        id: Date.now(),
        teacher: req.body.teacher,
        day: req.body.day,
        time:  req.body.time,
        place: req.body.place,
    };
    let guardias = [];
    guardias = JSON.parse(await fs.readFile('./jsonFiles/guardias.json', 'utf8'));
    guardias.push(guardia);
    await fs.writeFile('./jsonFiles/guardias.json', JSON.stringify(guardias));
    res.json(guardia);
});

app.delete('/guardias/:id', async (req, res) => {
    const id = req.params.id;
    let guardias = JSON.parse(await fs.readFile('./jsonFiles/guardias.json', 'utf8'));
    guardias = guardias.filter(guardia => guardia.id != id);
    await fs.writeFile('./jsonFiles/guardias.json', JSON.stringify(guardias));
    res.sendStatus(200);
});

// // Endpoint para eliminar una guardia
// app.delete('/guardias/:id', (req, res) => {
//     const { id } = req.params;
//     const index = guardias.findIndex(g => g.id == id);

//     if (index !== -1) {
//         guardias = guardias.filter(g => g.id != id);
//         res.status(204).send(); // No Content
//     } else {
//         res.status(404).send('Guardia no encontrada');
//     }
// });

app.put('/guardias/:id', async (req, res) => {
    const id = req.params.id;
    const guardias = JSON.parse(await fs.readFile('./jsonFiles/guardias.json', 'utf8'));
    const index = guardias.findIndex(guardia => guardia.id == id);
    guardias[index] = req.body;
    await fs.writeFile('./jsonFiles/guardias.json', JSON.stringify(guardias));
    res.json(req.body);
});






app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
