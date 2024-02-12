const addPopup = document.getElementById('addPopup');
const guardiaForm = document.getElementById('guardiaForm');
window.onload = function () {
    printGuardias();
};
addPopup.addEventListener('click', function () {
    guardiaForm.toggleAttribute('hidden');
});

guardiaForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(guardiaForm);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const guardia = {
        teacher: document.getElementById('teacher').value,
        day: document.getElementById('day').value,
        time: document.getElementById('time').value,
        place: document.getElementById('place').value,
    };
    const xmlhr = new XMLHttpRequest();
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 4) {
            if (xmlhr.status === 200) {
                console.log(xmlhr.responseText);
                window.location.reload();
            } else {
                console.log('Error: ' + xmlhr.status);
            }
        }
    }
    xmlhr.open('POST', '/addGuardia', true);
    xmlhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhr.send(JSON.stringify(guardia));
});

function printGuardias() {
    var xmlhr = new XMLHttpRequest();
    xmlhr.open('POST', '/guardias', true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === XMLHttpRequest.DONE) {
            if (xmlhr.status === 200) {
                var guardias = JSON.parse(xmlhr.responseText);

                const lunes = document.querySelector('#lunes');
                const martes = document.querySelector('#martes');
                const miercoles = document.querySelector('#miercoles');
                const jueves = document.querySelector('#jueves');
                const viernes = document.querySelector('#viernes');

                guardias.forEach(guardia => {
                    const div = document.createElement('div');
                    div.className = 'guard';

                    let content = `Profe: ${guardia.teacher} <br>`;
                    content += `Hora:  ${guardia.time} <br>`;
                    content += `${guardia.place}`;
                    div.innerHTML = content;

                    const crossButton = document.createElement('button');
                    crossButton.innerText = 'X';
                    crossButton.className = 'botonCerrar';
                    crossButton.onclick = function () {
                        var deleteXhr = new XMLHttpRequest();
                        deleteXhr.open('POST', `/eliminarGuardia/${guardia.id}`, true);
                        deleteXhr.onreadystatechange = function () {
                            if (deleteXhr.readyState === XMLHttpRequest.DONE) {
                                if (deleteXhr.status === 200) {
                                    div.remove(); // 
                                } else {
                                    console.error('Error al eliminar la guardia. Status:', deleteXhr.status, 'Response:', deleteXhr.responseText);
                                }
                            }
                        };
                        deleteXhr.send();
                    };
                    div.appendChild(crossButton);

                    switch (guardia.day) {
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
    xmlhr.send();
}

// function reload() {
//     var xmlhr = new XMLHttpRequest();
//     xmlhr.open('POST', '/guardias', true);
//     xmlhr.onreadystatechange = function () {
//         if (xmlhr.readyState === XMLHttpRequest.DONE) {
//             if (xmlhr.status === 200) {
//                 var guardias = JSON.parse(xmlhr.responseText);

//                 const lunes = document.querySelector('#lunes');
//                 const martes = document.querySelector('#martes');
//                 const miercoles = document.querySelector('#miercoles');
//                 const jueves = document.querySelector('#jueves');
//                 const viernes = document.querySelector('#viernes');

//                 // Vaciar el content anterior

//                 lunes.innerHTML = '<h2>Lunes</h2>';
//                 martes.innerHTML = '<h2>Martes</h2>';
//                 miercoles.innerHTML = '<h2>Miercoles</h2>';
//                 jueves.innerHTML = '<h2>Jueves</h2>';
//                 viernes.innerHTML = '<h2>Viernes</h2>';

//                 guardias.forEach(guardia => {
//                     const div = document.createElement('div');
//                     div.className = 'bloque'; //poner la clase generica
//                     div.style.backgroundColor = guardia.color;

//                     const contentContainer = document.createElement('div');

//                     let content = `<b> ${guardia.profesor}</b><br><br>`;
//                     content += `Clase: ${guardia.clase}<br>`;
//                     //content += `Dia: ${guardia.day}<br>`;
//                     content += `${guardia.horaInicio} - ${guardia.horaFin}<br>`;

//                     contentContainer.innerHTML = content;
//                     div.appendChild(contentContainer);

//                     // Add a click event listener to the div
//                     contentContainer.addEventListener('click', function () {
//                         // If the div is showing the regular content, change it to show guardia.observaciones
//                         if (contentContainer.innerHTML === content) {
//                             contentContainer.innerHTML = '<b>Observaciones</b> <br><br>' + guardia.observaciones;
//                         }
//                         // If the div is showing guardia.observaciones, change it back to the regular content
//                         else {
//                             contentContainer.innerHTML = content;
//                         }
//                     });

//                     switch (guardia.day) {
//                         case 'lunes':
//                             lunes.appendChild(div);
//                             break;
//                         case 'martes':
//                             martes.appendChild(div);
//                             break;
//                         case 'miercoles':
//                             miercoles.appendChild(div);
//                             break;
//                         case 'jueves':
//                             jueves.appendChild(div);
//                             break;
//                         case 'viernes':
//                             viernes.appendChild(div);
//                             break;
//                     }
//                 });
//             } else {
//                 console.error('Error al obtener los datos de guardias');
//             }
//         }
//     };
//     xmlhr.send();

// }
