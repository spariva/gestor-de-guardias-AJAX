const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Para que los archivos estaticos queden disponibles y pueda leer los css y acceder a otras carpetas
app.use(express.static(path.join(__dirname, '..', 'public')));

// Add this line to serve your JavaScript files
app.use('/js', express.static(path.join(__dirname, '..', 'js')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'login.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());


app.post('/validarUsuario', (req, res) => {
    const { usuario, contrasena } = req.body;

    fs.readFile('../json/usuarios.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Error al leer el archivo usuarios.json');
            res.status(500).json({ error: 'Error al leer el archivo usuarios.json' });
            return;
        }

        const usuarios = JSON.parse(data);
        const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);

        if (usuarioEncontrado) {
            console.log('Bien al leer el archivo usuarios.json');
            res.status(200).json({ tipo: usuarioEncontrado.tipo });
        } else {
            res.status(401).json({ error: 'Problema al reconocer credenciales' });
        }
    });
});

app.post('/listaProfesores', (req, res) => {
    fs.readFile('../json/usuarios.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        try {
            const usuarios = JSON.parse(data);

            const profesores = usuarios.filter(user => user.tipo === 'profesor');

            const profesoresInfo = profesores.map(profesor => ({
                nombre: profesor.usuario,
                horasLibres: profesor.horasLibres,
                color: profesor.color
            }));

            res.send(profesoresInfo);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/listaProfesoresForm', (req, res) => {
    fs.readFile('../json/usuarios.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        try {
            const usuarios = JSON.parse(data);

            const profesores = usuarios.filter(user => user.tipo === 'profesor');

            const nombresProfesores = profesores.map(profesor => profesor.usuario);
            res.send(nombresProfesores);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/anadirGuardia', (req, res) => {
    fs.readFile('../json/usuarios.json', (err, data) => {
        if (err) throw err;

        let usuarios = JSON.parse(data);
        let profesor = usuarios.find(user => user.tipo === 'profesor' && user.usuario === req.body.profesor);

        if (profesor) {
            if (profesor.horasLibres < 1) {
                res.redirect('/html/admin.html?error=El profesor no tiene horas libres');
                return;
            }

            profesor.horasLibres -= 1;

            fs.writeFile('../json/usuarios.json', JSON.stringify(usuarios), error => {
                if (error) throw error;
            });

            const guardia = {
                id: Date.now(),
                profesor: req.body.profesor,
                clase: req.body.clase,
                dia: req.body.dia,
                horaInicio: req.body.horaInicio,
                horaFin: req.body.horaFin,
                observaciones: req.body.observaciones,
                color: profesor.color
            };

            fs.readFile('../json/horario.json', (err, data) => {
                if (err && err.code === 'ENOENT') {
                    return fs.writeFile('../json/horario.json', JSON.stringify([guardia]), error => {
                        if (error) throw error;
                        res.redirect('/html/admin.html?mensaje=¡Guardia añadida y fichero JSON creado!');
                    });
                } else if (err) {
                    throw err;
                }

                let guardias = [];
                if (data.toString()) {
                    guardias = JSON.parse(data);
                }
                guardias.push(guardia);

                fs.writeFile('../json/horario.json', JSON.stringify(guardias), error => {
                    if (error) res.redirect('/html/admin.html?error=Error al añadir la guardia');
                    res.redirect('/html/admin.html?mensaje=¡Guardia añadida!');
                });
            });
        } else {
            res.redirect('/html/admin.html?error=El profesor no existe');
        }
    });
});

app.post('/anadirSugerencia', (req, res) => {
    fs.readFile('../json/usuarios.json', (err, data) => {
        if (err) throw err;

        let usuarios = JSON.parse(data);
        let profesor = usuarios.find(user => user.usuario === req.body.profesor);

        if (profesor) {

            fs.writeFile('../json/usuarios.json', JSON.stringify(usuarios), error => {
                if (error) throw error;
            });

            const sugerencia = {
                id: Date.now(),
                profesor: req.body.profesor,
                clase: req.body.clase,
                dia: req.body.dia,
                horaInicio: req.body.horaInicio,
                horaFin: req.body.horaFin,
                comentario: req.body.observaciones,
                color: profesor.color
            };

            fs.readFile('../json/sugerencias.json', (err, data) => {
                if (err && err.code === 'ENOENT') {
                    return fs.writeFile('../json/sugerencias.json', JSON.stringify([sugerencia]), error => {
                        if (error) throw error;
                        res.redirect('/html/index.html?mensaje=¡Sugerencia añadida y fichero JSON creado!');
                    });
                } else if (err) {
                    throw err;
                }

                let sugerencias = [];
                if (data.toString()) {
                    sugerencias = JSON.parse(data);
                }
                sugerencias.push(sugerencia);

                fs.writeFile('../json/sugerencias.json', JSON.stringify(sugerencias), error => {
                    if (error) res.redirect('/html/admin.html?error=Error al añadir la guardia');
                    res.redirect(`/html/index.html?mensaje=¡Sugerencia añadida!&profesor=${encodeURIComponent(req.body.profesor)}`);
                });
            });
        } else {
            res.redirect('/html/index.html?error=El profesor no existe');
        }
    });
});


app.post('/anadirDisponibilidad', (req, res) => {

    const dispo = {
        id: Date.now(),
        profesor: req.body.profesor,
        dia: req.body.dia,
        horaInicio: req.body.horaInicio,
        horaFin: req.body.horaFin
    };

    fs.readFile('../json/disponibilidad.json', (err, data) => {
        if (err && err.code === 'ENOENT') {
            return fs.writeFile('../json/disponibilidad.json', JSON.stringify([dispo]), error => {
                if (error) throw error;
                res.redirect(`/html/index.html?mensaje=¡Dispo añadida!&profesor=${encodeURIComponent(req.body.profesor)}`);
            });
        } else if (err) {
            throw err;
        }

        let disponibilidad = [];
        if (data.toString()) {
            disponibilidad = JSON.parse(data);
        }
        disponibilidad.push(dispo);

        fs.writeFile('../json/disponibilidad.json', JSON.stringify(disponibilidad), error => {
            if (error) res.redirect(`/html/index.html?mensaje=¡Error al añadir!&profesor=${encodeURIComponent(req.body.profesor)}`);
            res.redirect(`/html/index.html?mensaje=¡Sugerencia añadida!&profesor=${encodeURIComponent(req.body.profesor)}`);
        });
    });
});

app.post('/anadirProfesor', (req, res) => {
    const profesor = {
        usuario: req.body.nombreProfesor,
        contrasena: req.body.contrasenaNueva,
        tipo: "profesor",
        horasLibres: 5,
        color: req.body.color
    };

    fs.readFile('../json/usuarios.json', (err, data) => {
        if (err && err.code === 'ENOENT') {
            // Si el archivo no existe, crea uno nuevo
            return fs.writeFile('../json/usuarios.json', JSON.stringify([usuario]), error => {
                if (error) throw error;
                res.redirect('/html/admin.html?mensaje=Profesor añadido y fichero JSON creado!');
            });
        } else if (err) {
            throw err;
        }

        let usuarios = [];
        if (data.toString()) {
            usuarios = JSON.parse(data);
        }
        usuarios.push(profesor);

        fs.writeFile('../json/usuarios.json', JSON.stringify(usuarios), error => {
            if (error) res.redirect('/html/admin.html?error=Error al añadir la guardia');

            res.redirect('/html/admin.html?mensaje=¡Guardia añadida!');
        });
    });
});

app.post('/eliminarProfesor', (req, res) => {
    const nombreProfesor = req.body.profesor;

    // Read usuarios.json
    fs.readFile('../json/usuarios.json', (err, data) => {
        if (err) throw err;

        let usuarios = JSON.parse(data);
        usuarios = usuarios.filter(profesor => profesor.usuario !== nombreProfesor);

        // Write the updated list back to usuarios.json
        fs.writeFile('../json/usuarios.json', JSON.stringify(usuarios), error => {
            if (error) res.redirect('/html/admin.html?error=Error al eliminar el profesor');
        });
    });

    // Read horario.json
    fs.readFile('../json/horario.json', (err, data) => {
        if (err) throw err;

        let horario = JSON.parse(data);
        horario = horario.filter(guardia => guardia.profesor !== nombreProfesor);

        // Write the updated list back to horario.json
        fs.writeFile('../json/horario.json', JSON.stringify(horario), error => {
            if (error) res.redirect('/html/admin.html?error=Error al eliminar las guardias del profesor');
            res.redirect('/html/admin.html?mensaje=¡Profesor y sus guardias eliminados!');
        });
    });
});

// Ruta para enviar los datos de las guardias al cliente
app.post('/guardias', (req, res) => {
    fs.readFile('../json/horario.json', (err, data) => {
        if (err) throw err;
        let guardias = [];
        if (data.toString()) {
            guardias = JSON.parse(data);
        }

        // Ordenar las guardias por día y luego por hora de inicio
        guardias.sort((a, b) => {
            // Ordenar alfabéticamente por día
            if (a.dia < b.dia) return -1;
            if (a.dia > b.dia) return 1;

            // Si el día es el mismo, ordenar por hora de inicio
            if (a.horaInicio < b.horaInicio) return -1;
            if (a.horaInicio > b.horaInicio) return 1;

            return 0;
        });

        res.status(200).send(guardias);
    });
});

// app.post('/verDisponibilidad', (req, res) => {
//     fs.readFile('../json/disponibilidad.json', (err, data) => {
//         if (err) throw err;
//         let disponibilidad = [];
//         if (data.toString()) {
//             disponibilidad = JSON.parse(data);
//         }

//         // Ordenar las guardias por día y luego por hora de inicio
//         disponibilidad.sort((a, b) => {
//             // Ordenar alfabéticamente por día
//             if (a.dia < b.dia) return -1;
//             if (a.dia > b.dia) return 1;

//             // Si el día es el mismo, ordenar por hora de inicio
//             if (a.horaInicio < b.horaInicio) return -1;
//             if (a.horaInicio > b.horaInicio) return 1;

//             return 0;
//         });

//         res.status(200).send(disponibilidad);
//     });
// });

app.post('/disponibilidadProfesor', (req, res) => {
    const nombreProfesor = req.body.nombreProfesor;
    console.log(nombreProfesor);
    fs.readFile('../json/disponibilidad.json', (err, data) => {
        if (err) throw err;
        let disponibilidad = [];
        if (data.toString()) {
            disponibilidad = JSON.parse(data);
        }

        disponibilidad = disponibilidad.filter(dispo => dispo.profesor === nombreProfesor);

        res.status(200).send(disponibilidad);
    });
});

app.post('/guardiasProfesor', (req, res) => {
    const nombreProfesor = req.body.nombreProfesor;
    console.log(nombreProfesor);
    fs.readFile('../json/horario.json', (err, data) => {
        if (err) throw err;
        let guardias = [];
        if (data.toString()) {
            guardias = JSON.parse(data);
        }

        guardias = guardias.filter(guardia => guardia.profesor === nombreProfesor);

        res.status(200).send(guardias);
    });
});

// Ruta para enviar los datos de las guardias al cliente
app.post('/sugerencias', (req, res) => {
    fs.readFile('../json/sugerencias.json', (err, data) => {
        if (err) throw err;
        let sugerencias = [];
        if (data.toString()) {
            sugerencias = JSON.parse(data);
        }

        sugerencias.sort((a, b) => {
            // Ordenar alfabéticamente por día
            if (a.dia < b.dia) return -1;
            if (a.dia > b.dia) return 1;

            // Si el día es el mismo, ordenar por hora de inicio
            if (a.horaInicio < b.horaInicio) return -1;
            if (a.horaInicio > b.horaInicio) return 1;

            return 0;
        });

        res.status(200).send(sugerencias);
    });
});

app.post('/eliminarGuardia/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Deleting id: ${id}`); // Log the id

    fs.readFile('../json/horario.json', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`); // Log the error
            res.status(500).send('Server error');
            return;
        }

        let guardias = JSON.parse(data);

        const index = guardias.findIndex(guardia => guardia.id == id);

        if (index === -1) {
            res.status(404).send('Guardia no encontrada');
            return;
        }

        // Guardar el nombre del profesor antes de eliminar la guardia
        const profesorName = guardias[index].profesor;

        guardias.splice(index, 1);// eliminar la tarea 

        fs.writeFile('../json/horario.json', JSON.stringify(guardias), (err) => {
            if (err) {
                console.error(`Error writing file: ${err}`); // Log the error
                res.status(500).send('Server error');
                return;
            }

            fs.readFile('../json/usuarios.json', (err, data) => {
                if (err) throw err;

                let usuarios = JSON.parse(data);
                let profesor = usuarios.find(user => user.tipo === 'profesor' && user.usuario === profesorName);

                if (profesor) {
                    profesor.horasLibres += 1;

                    fs.writeFile('../json/usuarios.json', JSON.stringify(usuarios), error => {
                        if (error) throw error;
                    });
                }
            });
            res.status(200);
        });
    });
});

app.post('/eliminarSugerencia/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Deleting id: ${id}`); // Log the id

    fs.readFile('../json/sugerencias.json', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`); // Log the error
            res.status(500).send('Server error');
            return;
        }

        let sugerencias = JSON.parse(data);

        const index = sugerencias.findIndex(sugerencia => sugerencia.id == id);

        if (index === -1) {
            res.status(404).send('sugerencia no encontrada');
            return;
        }

        // Guardar el nombre del profesor antes de eliminar la guarsugerenciadsugerenciaia
        const profesorName = sugerencias[index].profesor;

        sugerencias.splice(index, 1);// eliminar la tarea 

        fs.writeFile('../json/sugerencias.json', JSON.stringify(sugerencias), (err) => {
            if (err) {
                console.error(`Error writing file: ${err}`); // Log the error
                res.status(500).send('Server error');
                return;
            }
            res.status(200);
        });
    });
});


app.post('/eliminarDispo/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Deleting id: ${id}`); // Log the id

    fs.readFile('../json/disponibilidad.json', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`); // Log the error
            res.status(500).send('Server error');
            return;
        }

        let disponibilidad = JSON.parse(data);

        const index = disponibilidad.findIndex(dispo => dispo.id == id);

        if (index === -1) {
            res.status(404).send('dispo no encontrada');
            return;
        }

        const profesorName = disponibilidad[index].profesor;

        disponibilidad.splice(index, 1);// eliminar la tarea 

        fs.writeFile('../json/disponibilidad.json', JSON.stringify(disponibilidad), (err) => {
            if (err) {
                console.error(`Error writing file: ${err}`); // Log the error
                res.status(500).send('Server error');
                return;
            }
            res.status(200);
        });
    });
});

app.listen(3001, () => console.log('Servidor escuchando en el puerto 3001'));