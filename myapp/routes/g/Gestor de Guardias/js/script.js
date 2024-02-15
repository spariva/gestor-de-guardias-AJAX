document.getElementById('mostrarTodo').addEventListener('click', mostrarTodo);

document.getElementById('hacerSugerencia').addEventListener('click', function () {
    const form = document.getElementById('formSugerencia');
    form.classList.toggle('hidden');
});

document.getElementById('anadirDisponibilidad').addEventListener('click', function () {
    const form = document.getElementById('formDisponibilidad');
    form.classList.toggle('hidden');
});

window.onload = function () {
    saludar();
    mostrarTodo();
    notificar();
    mostrarDisponibilidad();
}

const urlParams = new URLSearchParams(window.location.search);
const nombreProfesor = urlParams.get('profesor');
let urlMensaje = urlParams.get('mensaje');

if (urlMensaje == null) {
    urlMensaje = 'Bienvenid@ a tu área personal';
}

sessionStorage.setItem('usuario', nombreProfesor);
sessionStorage.setItem('mensaje', urlMensaje);

document.getElementById('profesorSugerencia').value = nombreProfesor;
document.getElementById('profesorDisponibilidad').value = nombreProfesor;


function notificar() {
    const mensaje = sessionStorage.getItem('mensaje');
    const notificaciones = document.getElementById('notificaciones');

    notificaciones.textContent = mensaje;

    setTimeout(function () {
        notificaciones.classList.add('hidden');
    }, 5000);
}

function saludar() {
    const saludo = document.getElementById('saludo');
    var textoSaludo = nombreProfesor;
    saludo.innerHTML = textoSaludo;
}


function mostrarTodo() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/guardias', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var guardias = JSON.parse(xhr.responseText);

                const lunes = document.querySelector('#lunes');
                const martes = document.querySelector('#martes');
                const miercoles = document.querySelector('#miercoles');
                const jueves = document.querySelector('#jueves');
                const viernes = document.querySelector('#viernes');

                // Vaciar el contenido anterior

                lunes.innerHTML = '<h2>Lunes</h2>';
                martes.innerHTML = '<h2>Martes</h2>';
                miercoles.innerHTML = '<h2>Miercoles</h2>';
                jueves.innerHTML = '<h2>Jueves</h2>';
                viernes.innerHTML = '<h2>Viernes</h2>';

                guardias.forEach(guardia => {
                    const div = document.createElement('div');
                    div.className = 'bloque'; //poner la clase generica
                    div.style.backgroundColor = guardia.color;

                    const contentContainer = document.createElement('div');

                    let contenido = `<b> ${guardia.profesor}</b><br><br>`;
                    contenido += `Clase: ${guardia.clase}<br>`;
                    //contenido += `Dia: ${guardia.dia}<br>`;
                    contenido += `${guardia.horaInicio} - ${guardia.horaFin}<br>`;

                    contentContainer.innerHTML = contenido;
                    div.appendChild(contentContainer);

                    // Add a click event listener to the div
                    contentContainer.addEventListener('click', function () {
                        // If the div is showing the regular content, change it to show guardia.observaciones
                        if (contentContainer.innerHTML === contenido) {
                            contentContainer.innerHTML = '<b>Observaciones</b> <br><br>' + guardia.observaciones;
                        }
                        // If the div is showing guardia.observaciones, change it back to the regular content
                        else {
                            contentContainer.innerHTML = contenido;
                        }
                    });

                    switch (guardia.dia) {
                        case 'lunes':
                            lunes.appendChild(div);
                            break;
                        case 'martes':
                            martes.appendChild(div);
                            break;
                        case 'miercoles':
                            miercoles.appendChild(div);
                            break;
                        case 'jueves':
                            jueves.appendChild(div);
                            break;
                        case 'viernes':
                            viernes.appendChild(div);
                            break;
                    }
                });
            } else {
                console.error('Error al obtener los datos de guardias');
            }
        }
    };
    xhr.send();

}

document.getElementById('mostrarMio').addEventListener('click', function () {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/guardiasProfesor', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var guardias = JSON.parse(xhr.responseText);

                const lunes = document.querySelector('#lunes');
                const martes = document.querySelector('#martes');
                const miercoles = document.querySelector('#miercoles');
                const jueves = document.querySelector('#jueves');
                const viernes = document.querySelector('#viernes');

                // Vaciar el contenido anterior

                lunes.innerHTML = '<h2>Lunes</h2>';
                martes.innerHTML = '<h2>Martes</h2>';
                miercoles.innerHTML = '<h2>Miercoles</h2>';
                jueves.innerHTML = '<h2>Jueves</h2>';
                viernes.innerHTML = '<h2>Viernes</h2>';

                guardias.forEach(guardia => {
                    const div = document.createElement('div');
                    div.className = 'bloque'; //poner la clase generica
                    div.style.backgroundColor = guardia.color;

                    const contentContainer = document.createElement('div');

                    let contenido = `<b> ${guardia.profesor}</b><br><br>`;
                    contenido += `Clase: ${guardia.clase}<br>`;
                    //contenido += `Dia: ${guardia.dia}<br>`;
                    contenido += `${guardia.horaInicio} - ${guardia.horaFin}<br>`;

                    contentContainer.innerHTML = contenido;
                    div.appendChild(contentContainer);

                    // Add a click event listener to the div
                    contentContainer.addEventListener('click', function () {
                        // If the div is showing the regular content, change it to show guardia.observaciones
                        if (contentContainer.innerHTML === contenido) {
                            contentContainer.innerHTML = '<b>Observaciones</b> <br><br>' + guardia.observaciones;
                        }
                        // If the div is showing guardia.observaciones, change it back to the regular content
                        else {
                            contentContainer.innerHTML = contenido;
                        }
                    });

                    switch (guardia.dia) {
                        case 'lunes':
                            lunes.appendChild(div);
                            break;
                        case 'martes':
                            martes.appendChild(div);
                            break;
                        case 'miercoles':
                            miercoles.appendChild(div);
                            break;
                        case 'jueves':
                            jueves.appendChild(div);
                            break;
                        case 'viernes':
                            viernes.appendChild(div);
                            break;
                    }
                });
            } else {
                console.error('Error al obtener los datos de guardias');
            }
        }
    };

    const nombreProfesor = sessionStorage.getItem('usuario');
    const data = JSON.stringify({ nombreProfesor });
    xhr.send(JSON.stringify({ nombreProfesor: nombreProfesor }));
});


function mostrarDisponibilidad() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/disponibilidadProfesor', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var disponibilidad = JSON.parse(xhr.responseText);

                const dlunes = document.querySelector('#disponibilidadLunes');
                const dmartes = document.querySelector('#disponibilidadMartes');
                const dmiercoles = document.querySelector('#disponibilidadMiercoles');
                const djueves = document.querySelector('#disponibilidadJueves');
                const dviernes = document.querySelector('#disponibilidadViernes');

                // Vaciar el contenido anterior

                dlunes.innerHTML = '<h2>Lunes</h2>';
                dmartes.innerHTML = '<h2>Martes</h2>';
                dmiercoles.innerHTML = '<h2>Miercoles</h2>';
                djueves.innerHTML = '<h2>Jueves</h2>';
                dviernes.innerHTML = '<h2>Viernes</h2>';

                disponibilidad.forEach(dispo => {
                    const div = document.createElement('div');
                    div.className = 'bloqueDispo'; //poner la clase generica

                    const contentContainer = document.createElement('div');

                    let contenido = `<b> ${dispo.profesor}</b><br><br>`;
                    contenido += `${dispo.horaInicio} - ${dispo.horaFin}<br>`;

                    contentContainer.innerHTML = contenido;
                    div.appendChild(contentContainer);

                    // botón de eliminar
                    const closeButton = document.createElement('button');
                    closeButton.innerText = 'X';
                    closeButton.className = 'botonCerrar';
                    closeButton.onclick = function () {
                        var deleteXhr = new XMLHttpRequest();
                        deleteXhr.open('POST', `/eliminarDispo/${dispo.id}`, true);
                        deleteXhr.onreadystatechange = function () {
                            if (deleteXhr.readyState === XMLHttpRequest.DONE) {
                                if (deleteXhr.status === 200) {
                                    div.remove(); 
                                } else {
                                    console.error('Error al eliminar la dispo. Status:', deleteXhr.status, 'Response:', deleteXhr.responseText);
                                }
                            }
                        };
                        deleteXhr.send();
                        window.location.href = 'index.html?profesor=' + nombreProfesor;
                    };
                    div.appendChild(closeButton);


                    switch (dispo.dia) {
                        case 'lunes':
                            dlunes.appendChild(div);
                            break;
                        case 'martes':
                            dmartes.appendChild(div);
                            break;
                        case 'miercoles':
                            dmiercoles.appendChild(div);
                            break;
                        case 'jueves':
                            djueves.appendChild(div);
                            break;
                        case 'viernes':
                            dviernes.appendChild(div);
                            break;
                    }
                });
            } else {
                console.error('Error al obtener los datos de disponibilidad');
            }
        }
    };
    const nombreProfesor = sessionStorage.getItem('usuario');
    xhr.send(JSON.stringify({ nombreProfesor: nombreProfesor }));
}