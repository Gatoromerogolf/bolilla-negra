// script.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('encabezado.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading the header:', error);
        });
});
