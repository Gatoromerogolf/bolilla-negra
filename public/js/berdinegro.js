

async function main() {
    berdiNegro = await leerDatosBerdiNegro();
    console.log(berdiNegro[0].hoyo)
    console.log(berdiNegro[0]["berdi-fecha"]);
}

main().then(() => {
    const resultado = document.getElementById("berdinegro").getElementsByTagName("tbody")[0]; // Ejecuta la función principal
    for (let i = 1; i < 19; i++) {
        let par = 0;
        switch (i) {
            case 1:
            case 2:
            case 3:   
            case 6:
            case 9:
            case 10:
            case 11:
            case 12:   
            case 15:
            case 18:
                par = 4;
                break;
            case 4:
            case 8:
            case 13:
            case 17:
                par = 3;
                break;
            case 5:
            case 7:
            case 14:
            case 16:
                par = 5;
                break
            default:
                par = 99;
                // Código a ejecutar si ninguno de los casos coincide
        }

        const filaResultado = resultado.insertRow(-1);
        const celdahoyo = filaResultado.insertCell(-1);
        celdahoyo.textContent = i;

        let registro = berdiNegro.find(reg => reg.hoyo === i);

        if (registro) {
            let fechaBerdi = filaResultado.insertCell(-1);
            fechaBerdi.textContent = "--";
            fechaBerdi.textContent = registro["berdi-fecha"] ?? "--";
    
            let playerBerdi = filaResultado.insertCell(-1);
            playerBerdi.textContent = registro["berdi-player"] ?? "--";

            let fechaNegro = filaResultado.insertCell(-1);
            fechaNegro.textContent = registro["negro-fecha"] ?? "--";
    
            let playerNegro = filaResultado.insertCell(-1);
            playerNegro.textContent = registro["negro-player"] ?? "--";

            let scoreNegro = filaResultado.insertCell(-1);
            scoreNegro.textContent = registro["negro-score"] ?? "--";

            let parNegro = filaResultado.insertCell(-1);
            parNegro.textContent = par;
        } else {
            let fechaBerdi = filaResultado.insertCell(-1);
            fechaBerdi.textContent = "--";
    
            let playerBerdi = filaResultado.insertCell(-1);
            playerBerdi.textContent = "--";

            let fechaNegro = filaResultado.insertCell(-1);
            fechaNegro.textContent = "--";
    
            let playerNegro = filaResultado.insertCell(-1);
            playerNegro.textContent = "--";

            let scoreNegro = filaResultado.insertCell(-1);
            scoreNegro.textContent = "--";

            let parNegro = filaResultado.insertCell(-1);
            parNegro.textContent = par;
        }
    }


});

async function leerDatosBerdiNegro() {
    try {
        const response = await fetch(`/leerBerdiNegro`);
        if (response.ok) {
            const data = await response.json(); // Convertir response a JSON
            console.table(data)
            return data; // Devuelve los datos obtenidos si la respuesta es exitosa
        } else {
            console.error(
                "Error en la respuesta:",
                response.status,
                response.statusText
            );
            return null;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return null;
    }
}
