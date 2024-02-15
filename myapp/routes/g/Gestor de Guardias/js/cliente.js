const inputUsuario = document.getElementById('usuario');
const inputContrasena = document.getElementById('contrasena');
document.getElementById('botonLogin').addEventListener('click', iniciarSesion);

function iniciarSesion(event) {
    event.preventDefault();

    const tipo = document.getElementById('tipo').value;
    let usuario; // Declarar la variable usuario aquí

    if (tipo === 'admin') {
        usuario = 'admin';
    } else {
        const listadoUsuarios = document.getElementById('listadoUsuarios');
        if (listadoUsuarios.style.display !== 'none') {
            usuario = document.getElementById('usuario').value; // Asegúrate de obtener el valor del elemento correcto
        }
    }
    const contrasena = inputContrasena.value;

    if(tipo == 'admin') {
        usuario= 'admin';
    }

    const xmlhr = new XMLHttpRequest();
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4) {
            if (xmlhr.status === 200) {
                const response = JSON.parse(xmlhr.responseText);
                const tipo = response.tipo;

                if (tipo === 'admin') {
                    console.log('Sesion iniciada como admin');
                    window.location.href = '/html/admin.html';
                } else if (tipo === 'profesor') {
                    console.log('Session iniciada como profesor');
                    window.location.href = '/html/index.html?profesor=' + usuario;
                } else {
                    console.log('Problema al reconocer credenciales');
                }
            } else {
                console.log('Problema al iniciar sesion');
            }
        }
    };

    xmlhr.open('POST', '/validarUsuario', true);
    xmlhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhr.send(JSON.stringify({ usuario: usuario, contrasena: contrasena }));
}

document.getElementById('tipo').addEventListener('change', function() {
    if (this.value === 'profesor') {
        document.getElementById('listadoUsuarios').style.display = 'block';
        cargarListadoProfesores();
    } else {
        document.getElementById('listadoUsuarios').style.display = 'none';
    }
});

function cargarListadoProfesores() {
    const selectProfesores = document.getElementById('usuario');

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