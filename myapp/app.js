//Paths:
const path = require('path');
const basePath = __dirname;
const publicPath = path.join(basePath, 'public');
// const adminPath = path.join(basePath, 'public/admin.html');
// const teacherPath = path.join(basePath, 'public/teacher.html');
// const loginPath = path.join(basePath, 'public/login.html');
const envPath = path.join(basePath, '.env');
//Dotenv:
require('dotenv').config({path: envPath});
//Express:
const express = require('express');
const fs = require('fs').promises;
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY; // Replace with your own secret key
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicPath));

app.use(express.json());

//*Login:
app.post('/login', async (req, res) => {
    const users = await fs.readFile('./jsonFiles/users.json');
    users = JSON.parse(users);
    const user = users.find(u => u.name === req.body.name && u.password === req.body.password);

    if (user) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ message: 'Login successful!', token });
    } else {
        return res.status(401).send('Invalid username or password.');
    }
});

app.get('/admin', verifyToken, (req, res) => {
    // If we reach this point, the user is authenticated
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

//*Error handling:
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.delete('//:id', (req, res) => {
//   const id = req.params.id;

//   fs.readFile('tareas.json', (err, data) => {
//       if (err) throw err;

//       let tareas = JSON.parse(data);

//       // Encontrar el índice de la tarea con el ID correspondiente
//       const index = tareas.findIndex(tarea => tarea.id == id);

//       // Si la tarea no se encuentra, enviar un error
//       if (index === -1) {
//           res.status(404).send('Tarea no encontrada');
//           return;
//       }

//       // Eliminar la tarea del array
//       tareas.splice(index, 1);

//       fs.writeFile('tareas.json', JSON.stringify(tareas), (err) => {
//           if (err) throw err;
//           res.sendStatus(200);
//       });
//   });
// });

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
