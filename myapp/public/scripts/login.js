function login(name, password) {
    const xmlhr = new XMLHttpRequest();
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4 && xmlhr.status === 200) {
            const data = JSON.parse(xmlhr.responseText);
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/admin';
            } else {
                alert('Credenciales equivocados, dale al botón `profe` si eres profe.');
            }
        }
    };
    xmlhr.open('POST', '/login2', true);
    xmlhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xmlhr.send(JSON.stringify({ name: name, password: password }));
}



document.getElementById('loginSubmit').addEventListener('click', function(event) {
    event.preventDefault();    
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    login(name, password);
});

// const login = (name, password) => {
//     fetch('/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ name, password })
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.token) {
//                 localStorage.setItem('token', data.token);
//                 window.location.href = '/admin';
//             } else {
//                 alert('Invalid username or password.');
//             }
//         });
// };