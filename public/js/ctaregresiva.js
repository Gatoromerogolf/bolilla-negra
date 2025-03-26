

function cuentaRegresiva(fechaObjetivo) {
    // Calcular la diferencia entre la fechaObjetivo y ahora
    const actualizarCuentaRegresiva = () => {
      const ahora = new Date().getTime();
      // console.log("Fecha actual en milisegundos:", ahora);
      // console.log("Fecha objetivo en milisegundos:", fechaObjetivo);
      const diferencia = fechaObjetivo - ahora;

      // console.log (diferencia)
  
      // Convertir la diferencia de milisegundos a días, horas, minutos y segundos
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
  
   // Mostrar el resultado en el elemento deseado
   document.getElementById("cuentaRegresiva").innerHTML = 
   `${dias} días ${horas} horas <br> ${minutos} minutos `;

  
      // Si la cuenta regresiva termina, mostrar algún mensaje
      if (diferencia < 0) {
        clearInterval(x);
        document.getElementById("cuentaRegresiva").innerHTML = "¡La fiesta empezó!!!!";
      }
    };
  
    // Actualizar la cuenta regresiva cada segundo
    let x = setInterval(actualizarCuentaRegresiva, 1000);
  }
  
  // Establece la fecha objetivo (año, mes, día, hora, minuto, segundo)
  // Nota: Los meses en JavaScript van de 0 a 11, por lo que enero es 0 y diciembre es 11.
  const fechaObjetivo = new Date(2025, 3, 2, 7, 0, 0).getTime();
  
  // Iniciar la cuenta regresiva
  cuentaRegresiva(fechaObjetivo);
  