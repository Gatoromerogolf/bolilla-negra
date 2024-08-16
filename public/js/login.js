document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    // Realiza la solicitud al servidor para validar las credenciales
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login exitoso') {
            // Guardar el nombre de usuario en localStorage
            localStorage.setItem('usuario', data.user.usuario);
            window.location.href = '../src/carga.html';
        } else {
            console.error('Credenciales inválidas');
        }
    })
    .catch(error => {
        alert("usuario o clave invalidos");
        console.error('Error en la solicitud:', error);
    });
});
