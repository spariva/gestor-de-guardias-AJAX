function login(name, password) {
    $.ajax({
        url: '/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, password }),
        success: function(data) {
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/admin';
            } else {
                alert('Credenciales equivocados, dale al botón `profe` si eres profe.');
            }
        }
    });
} 



document.getElementById('adminLogin').addEventListener('click', function() {
    // Aquí va tu código para manejar el clic
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