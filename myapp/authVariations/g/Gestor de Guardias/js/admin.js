document.getElementById('mostrarFormulario').addEventListener('click', function () {
    const form = document.querySelector('.formulario');
    form.classList.toggle('hidden');
});

document.getElementById('anadirProfesor').addEventListener('click', function () {
    const formProfesor = document.querySelector('.formProfesores');
    formProfesor.classList.toggle('hidden');
});

document.getElementById('eliminarProfesor').addEventListener('click', function () {
    const formProfesor = document.querySelector('.formEliminarProfesores');
    formProfesor.classList.toggle('hidden');
});

document.getElementById('formDispo').addEventListener('submit', function(e) {
    e.preventDefault();

    mostrarDisponibilidad();
});

// Llamar a la función al cargar la página
window.onload = function () {
    mostrarFechaActual();
    cargarListadoProfesores();
    cargarListadoProfesoresParaForm();
    obtenerGuardias();
    obtenerSugerencias();
};

function mostrarFechaActual() {
    // Obtener la fecha actual
    var fecha = new Date();

    // Obtener día, mes y año
    var hora = fecha.getHours();
    var mins = fecha.getMinutes();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1; // Los meses empiezan desde 0
    var anio = fecha.getFullYear();

    // Formatear la fecha como "dd/mm/yyyy"
    var fechaFormateada = '  ' + dia + '/' + mes + '/' + anio + '  ' + hora + ':' + mins;

    // Mostrar la fecha en el elemento con el id "fechaActual"
    document.getElementById('fechaActual').textContent = fechaFormateada;
}

function cargarListadoProfesores() {
    const inputListadoProfesores = document.getElementById('listadoProfesores');

    const xmlhr = new XMLHttpRequest();
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 4) {
            if (xmlhr.status === 200) {
                const response = JSON.parse(xmlhr.responseText);
                response.forEach(profesor => {
                    const li = document.createElement('li');
                    li.className = 'listaProfesores';
                    li.style.color = profesor.color;
                    li.textContent = profesor.nombre;

                    const ul = document.createElement('ul');
                    const liHorasLibres = document.createElement('li');
                    liHorasLibres.textContent = `Horas libres: ${profesor.horasLibres}`;
                    liHorasLibres.className = 'listaHorasLibres';
                    ul.appendChild(liHorasLibres);

                    li.appendChild(ul);
                    inputListadoProfesores.appendChild(li);
                });
            } else {
                console.log('Problema al mostrar Profesores');
            }
        }
    };

    xmlhr.open('POST', '/listaProfesores', true);
    xmlhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhr.send();
}

function cargarListadoProfesoresParaForm() {
    const selectProfesores = document.getElementById('listaFormProfesores');
    const selectEliminarprofesores = document.getElementById('listaFormEliminarProfesores');
    const selectDisponibilidadprofesores = document.getElementById('listaDisponibilidadProfesores');

    const xmlhr = new XMLHttpRequest();
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 4) {
            if (xmlhr.status === 200) {
                const response = JSON.parse(xmlhr.responseText);
                response.forEach(profesor => {
                    const option = document.createElement('option');
                    option.textContent = profesor;
                    option.value = profesor;
                    selectProfesores.appendChild(option);
                    selectEliminarprofesores.appendChild(option.cloneNode(true));
                    selectDisponibilidadprofesores.appendChild(option.cloneNode(true));
                });
            } else {
                console.log('Problema al mostrar Profesores');
            }
        }
    };

    xmlhr.open('POST', '/listaProfesoresForm', true);
    xmlhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhr.send();
}

function obtenerGuardias() {
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

                    // botón de eliminar
                    const closeButton = document.createElement('button');
                    closeButton.innerText = 'X';
                    closeButton.className = 'botonCerrar';
                    closeButton.onclick = function () {
                        var deleteXhr = new XMLHttpRequest();
                        deleteXhr.open('POST', `/eliminarGuardia/${guardia.id}`, true);
                        deleteXhr.onreadystatechange = function () {
                            if (deleteXhr.readyState === XMLHttpRequest.DONE) {
                                if (deleteXhr.status === 200) {
                                    div.remove(); // Elimina la guardia de la interfaz de usuario
                                } else {
                                    console.error('Error al eliminar la guardia. Status:', deleteXhr.status, 'Response:', deleteXhr.responseText);
                                    window.location.href = 'admin.html?error=No se pudo eliminar la guardia';
                                }
                            }
                        };
                        deleteXhr.send();
                        window.location.href = 'admin.html?mensaje=Tarea Eliminada';
                    };
                    div.appendChild(closeButton);

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

function obtenerSugerencias() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/sugerencias', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var sugerencias = JSON.parse(xhr.responseText);

                const putSugerencia = document.querySelector('#sugerenciasProfesores');

                sugerencias.forEach(sugerencia => {
                    const div = document.createElement('div');
                    div.className = 'sugerencia';
                    div.style.backgroundColor = sugerencia.color;

                    const contentContainer = document.createElement('div');

                    let contenido = `<b> ${sugerencia.profesor}</b><br><br>`;
                    contenido += `Clase: ${sugerencia.clase}<br>`;
                    contenido += `${sugerencia.horaInicio} - ${sugerencia.horaFin}<br><br>`;
                    contenido += `${sugerencia.comentario}<br>`;

                    contentContainer.innerHTML = contenido;
                    div.appendChild(contentContainer);

                    // botón de eliminar
                    const closeButton = document.createElement('button');
                    closeButton.innerText = 'X';
                    closeButton.className = 'botonCerrar';
                    closeButton.onclick = function () {
                        var deleteXhr = new XMLHttpRequest();
                        deleteXhr.open('POST', `/eliminarSugerencia/${sugerencia.id}`, true);
                        deleteXhr.onreadystatechange = function () {
                            if (deleteXhr.readyState === XMLHttpRequest.DONE) {
                                if (deleteXhr.status === 200) {
                                    div.remove();
                                } else {
                                    console.error('Error al eliminar la sugerencia. Status:', deleteXhr.status, 'Response:', deleteXhr.responseText);
                                    window.location.href = 'admin.html?error=No se pudo eliminar la sugerencia';
                                }
                            }
                        };
                        deleteXhr.send();
                        window.location.href = 'admin.html?mensaje=Sugerencia Eliminada';
                    };
                    div.appendChild(closeButton);

                    putSugerencia.appendChild(div);

                });
            } else {
                console.error('Error al obtener los datos de guardias');
            }
        }
    };
    xhr.send();
}

function mostrarDisponibilidad() {
    const nombreProfesor = document.querySelector('#listaDisponibilidadProfesores').value;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/disponibilidadProfesor', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var disponibilidad = JSON.parse(xhr.responseText);

                const slunes = document.querySelector('#slunes');
                const smartes = document.querySelector('#smartes');
                const smiercoles = document.querySelector('#smiercoles');
                const sjueves = document.querySelector('#sjueves');
                const sviernes = document.querySelector('#sviernes');

                // Vaciar el contenido anterior

                slunes.innerHTML = '<h2>Lunes</h2>';
                smartes.innerHTML = '<h2>Martes</h2>';
                smiercoles.innerHTML = '<h2>Miercoles</h2>';
                sjueves.innerHTML = '<h2>Jueves</h2>';
                sviernes.innerHTML = '<h2>Viernes</h2>';

                disponibilidad.forEach(dispo => {
                    const div = document.createElement('div');
                    div.className = 'bloqueDispo'; 

                    const contentContainer = document.createElement('div');

                    let contenido = `<b> ${dispo.profesor}</b><br><br>`;
                    contenido += `${dispo.horaInicio} - ${dispo.horaFin}<br>`;

                    contentContainer.innerHTML = contenido;
                    div.appendChild(contentContainer);

                    switch (dispo.dia) {
                        case 'lunes':
                            slunes.appendChild(div);
                            break;
                        case 'martes':
                            smartes.appendChild(div);
                            break;
                        case 'miercoles':
                            smiercoles.appendChild(div);
                            break;
                        case 'jueves':
                            sjueves.appendChild(div);
                            break;
                        case 'viernes':
                            sviernes.appendChild(div);
                            break;
                    }
                });
            } else {
                console.error('Error al obtener los datos de disponibilidad');
            }
        }
    };
    xhr.send(JSON.stringify({ nombreProfesor: nombreProfesor }));
}