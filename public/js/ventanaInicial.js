// Cuando el usuario carga la página
window.onload = function() {
    var modal1 = document.getElementById("miModal1");
    var modal2 = document.getElementById("miModal2");
    var span1 = modal1.getElementsByClassName("cerrar")[0];
    var span2 = modal2.getElementsByClassName("cerrar")[0];

   
    var modal1Cerrado = false;
    var modal2Cerrado = false;

    // Función para mostrar el modal1 y   ocultar el modal2
    function mostrarModal1() {
        if (!modal1Cerrado) {
            modal1.style.display = "block";
            modal2.style.display = "none";
        }
    }

    // Función para mostrar el modal2 y ocultar el modal1
    function mostrarModal2() {
        if (!modal2Cerrado) {
            modal1.style.display = "none";
            modal2.style.display = "block";
        }
    }

    // Eventos para cerrar modales
    span1.onclick = function() {
        modal1.style.display = "none";
        modal1Cerrado = true;
    };
    
    span2.onclick = function() {
      modal2.style.display = "none";
      modal2Cerrado = true;
  };

    // Al hacer clic fuera del modal, cierra el modal abierto
    window.onclick = function(event) {
      if (event.target == modal1) {
          modal1.style.display = "none";
          modal1Cerrado = true;
      }
      if (event.target == modal2) {
          modal2.style.display = "none";
          modal2Cerrado = true;
      }
  };

    // Alternar entre modal1 y modal2 cada 5 segundos
    function alternarModales() {
      if (modal1.style.display === "block") {
          mostrarModal2();
      } else {
          mostrarModal1();
      }
      // Llamar setTimeout para repetir el proceso después de 5 segundos
      setTimeout(alternarModales, 5000);
  }

    // Iniciar el proceso de alternancia
    alternarModales();
};
    
//     // Muestra el modal
//     modal1.style.display = "block";

//     // Función para cerrar modales
//     function cerrarModal(modal) {
//       modal.style.display = "none";
//     }

//     // Eventos para cerrar modales
//     span1.onclick = function() { cerrarModal(modal1); }
//     span2.onclick = function() { cerrarModal(modal2); }

//     window.onclick = function(event) {
//         if (event.target == modal1) {
//             cerrarModal(modal1);
//         }
//         if (event.target == modal2) {
//             cerrarModal(modal2);
//         }
//     }

  
//   setInterval(function() {
//     if (modal1.style.display === "block") {
//         modal1.style.display = "none";
//         modal2.style.display = "block";
//     } else {
//         modal1.style.display = "block";
//         modal2.style.display = "none";
//     }
// }, 5000);
// }

  
//     // Cuando el usuario hace clic en <span> (x), cierra el modal
//     // span1.onclick = function() {
//     //   modal1.style.display = "none";
//     // }
  
//     // // También cierra el modal si el usuario hace clic fuera de él
//     // window.onclick = function(event) {
//     //   if (event.target == modal1) {
//     //     modal1.style.display = "none";
//     //   }
//     // }
//   // }
