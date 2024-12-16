// Identificador único de la encuesta (puedes cambiarlo por otro nombre según la encuesta)
const encuestaId = "encuesta-color-favorito"; 

// Opciones de la encuesta
const opciones = [
    { texto: "Sierra - Mismo hotel", votos: 0 },
    { texto: "Sierra - Otro", votos: 0 },
    { texto: "Tandil", votos: 0 },
    { texto: "Córdoba - Tanti", votos: 0 },
    { texto: "Córdoba - Otra sede", votos: 0 }
];

// Función para establecer una cookie
const setCookie = (name, value, days) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000); // Duración en días
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
};

// Función para obtener una cookie por su nombre
const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, val] = cookie.split("=");
        if (key === name) return val;
    }
    return null;
};

const manejarVoto = (index) => {
    // Verifica si la cookie existe
    if (getCookie(encuestaId)) {
        alert("Ya has votado en esta encuesta.");
        return;
    }

    // Registrar el voto
    opciones[index].votos++;
    setCookie(encuestaId, "true", 7); // Bloquear votación por 7 días
    actualizarResultados();

    // Mostrar mensaje de agradecimiento
    mostrarModal();
};

// Función para mostrar el modal
const mostrarModal = () => {
    const modal = document.getElementById("modalAgradecimiento");
    modal.style.display = "flex";
};

// Función para cerrar el modal
const cerrarModal = () => {
    const modal = document.getElementById("modalAgradecimiento");
    modal.style.display = "none";
};
// Función para calcular el total de votos
const totalVotos = () => opciones.reduce((acc, op) => acc + op.votos, 0);

// Función para actualizar los resultados de la encuesta
const actualizarResultados = () => {
    const contenedor = document.getElementById("opciones");
    contenedor.innerHTML = ""; // Limpiar antes de actualizar

    opciones.forEach((opcion, index) => {
        const total = totalVotos();
        const porcentaje = total > 0 ? Math.round((opcion.votos / total) * 100) : 0;

        // Crear elementos para la opción
        const divOpcion = document.createElement("div");
        divOpcion.className = "opcion";

        const texto = document.createElement("span");
        texto.textContent = `${opcion.texto} (${porcentaje}%)`;

        const boton = document.createElement("button");
        boton.textContent = "Votar";
        boton.onclick = () => manejarVoto(index);

        // Desactivar si ya votó
        boton.disabled = getCookie(encuestaId) !== null;

        const barra = document.createElement("div");
        barra.className = "barra";
        barra.style.width = `${porcentaje}%`;

        divOpcion.appendChild(texto);
        divOpcion.appendChild(boton);
        contenedor.appendChild(divOpcion);
        contenedor.appendChild(barra);
    });
};


// Inicializar encuesta al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    actualizarResultados();
});
