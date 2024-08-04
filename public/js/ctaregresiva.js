

function cuentaRegresiva(fechaObjetivo) {
    // Calcular la diferencia entre la fechaObjetivo y ahora
    const actualizarCuentaRegresiva = () => {
      const ahora = new Date();
      const diferencia = fechaObjetivo - ahora;

      console.log (diferencia)
  
      // Convertir la diferencia de milisegundos a días, horas, minutos y segundos
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
  
      // Mostrar el resultado en el elemento deseado
       document.getElementById("cuentaRegresiva").innerHTML = dias + " dias " + horas + " horas "
      + minutos + "m " + segundos + "s ";

  
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
  const fechaObjetivo = new Date("Mar 14, 2024 07:00:00").getTime();
  
  // Iniciar la cuenta regresiva
  cuentaRegresiva(fechaObjetivo);
  