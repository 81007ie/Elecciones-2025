// =======================================================
// CONFIGURACIÓN DEL FORMULARIO DE GOOGLE
// =======================================================

// URL de "formResponse"
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe11iGnsvIMlm1fQq8AuJG5o5aMgFurE4B3jBNPcrVjpswcEA/formResponse";

// Tus entries:
const ENTRY_GRADO = "entry.367300182";
const ENTRY_LISTA = "entry.1948584914";


// =======================================================
// CAPTURAR ELEMENTOS DEL FORMULARIO
// =======================================================

const formulario = document.getElementById("formulario-voto");
const boton = document.getElementById("boton-votar");
const votoInput = document.getElementById("voto-seleccionado");


// =======================================================
// SWIPER (selección de listas)
// =======================================================

let swiper = new Swiper(".swiper-container", {
  slidesPerView: 1,
  spaceBetween: 20,
  centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  }
});

document.querySelectorAll('.swiper-slide').forEach(slide => {
  slide.addEventListener('click', function () {
    document.querySelectorAll('.swiper-slide').forEach(s => s.classList.remove('selected'));
    this.classList.add('selected');
    votoInput.value = this.getAttribute('data-voto');
  });
});


// =======================================================
// ENVÍO DEL FORMULARIO
// =======================================================

formulario.addEventListener("submit", function (e) {
  e.preventDefault();
  enviarVoto();
});


function enviarVoto() {

  const grado = document.getElementById("grado").value;
  const lista = votoInput.value;

  if (!grado || !lista) {
    Swal.fire({
      icon: "warning",
      title: "Faltan datos",
      text: "Selecciona tu Grado y una Lista.",
      confirmButtonColor: "#1e3c72",
    });
    return;
  }

  boton.disabled = true;
  boton.textContent = "Enviando voto...";

  Swal.fire({
    title: "Registrando voto...",
    text: "Por favor espera...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  // Armar datos del formulario para Google Forms
  const formData = new FormData();
  formData.append(ENTRY_GRADO, grado);
  formData.append(ENTRY_LISTA, lista);

  // Envío directo al formResponse (no hay CORS)
  fetch(GOOGLE_FORM_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  })
    .then(() => {
      Swal.close();

      Swal.fire({
        icon: "success",
        title: "¡Voto registrado!",
        html: "Tu voto ha sido enviado correctamente.<br><br>🎉 Gracias por participar.",
        confirmButtonText: "Aceptar y reiniciar",
        confirmButtonColor: "#00AEEF",
      }).then(() => {
        window.location.reload();
      });

    })
    .catch(() => {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error al enviar",
        text: "No se pudo registrar el voto.",
        confirmButtonColor: "#d33",
      });

      boton.disabled = false;
      boton.textContent = "CONFIRMAR MI VOTO";
    });
}
