document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    
    const username = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

       // Obtener el parámetro 'redirect' de la URL
       const urlParams = new URLSearchParams(window.location.search);
       const redirectPage = urlParams.get('redirect') || 'carga'; // Por defecto, redirige a 'carga'


    // Realiza la solicitud al servidor para validar las credenciales
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login exitoso') {
            // Guardar el nombre de usuario en localStorage
            localStorage.setItem('usuario', data.user.username);

            // Redirigir según el valor del parámetro redirect
            if (redirectPage === 'comentarios') {
                window.location.href = '../src/comentarios.html';
            } else if (redirectPage === 'carga') {
            window.location.href = '../src/carga.html';
        } else {
            console.error('Credenciales inválidas');
        }
    }})
    .catch(error => {
        alert("usuario o clave invalidos");
        console.error('Error en la solicitud:', error);
    });
});
