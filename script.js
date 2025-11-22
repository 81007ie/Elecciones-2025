// ⚠️ 1. REEMPLAZA ESTA URL con la de tu ÚLTIMA implementación /exec
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmYyS1FCVNV5Dv9LGXKt_glMvROk9UkygjxAXBs2bSHv8DzdG7wkm7P-N6ewslptI_Lg/exec'; 

const formulario = document.getElementById('formulario-voto');
const boton = document.getElementById('boton-votar');
const votoInput = document.getElementById('voto-seleccionado');

// =======================================================
// INICIALIZACIÓN DEL CARRUSEL (SWIPER)
// =======================================================

let swiper = new Swiper('.swiper-container', {
    slidesPerView: 1, 
    spaceBetween: 20,
    loop: false,
    centeredSlides: true, 
    
    pagination: {
        el: '.swiper-pagination', 
        clickable: true,
    },
    
    breakpoints: {
        768: {
            slidesPerView: 1, 
            spaceBetween: 30,
            centeredSlides: true, 
        },
        1024: {
            slidesPerView: 1, 
            spaceBetween: 40,
            centeredSlides: true, 
        },
    }
});

// Listener para seleccionar un voto al hacer clic en la imagen
const slides = document.querySelectorAll('.swiper-slide');
slides.forEach(slide => {
    slide.addEventListener('click', function() {
        slides.forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
        votoInput.value = this.getAttribute('data-voto');
    });
});


// =======================================================
// LÓGICA DE ENVÍO DEL VOTO (CON SWEETALERT2)
// =======================================================
formulario.addEventListener('submit', function(e) {
    e.preventDefault(); 
    enviarVoto();
});

function enviarVoto() {
    const grado = document.getElementById('grado').value;
    const votoLista = votoInput.value;
    
    if (!grado || !votoLista) {
        // Alerta de error si faltan datos
        Swal.fire({
            icon: 'warning',
            title: 'Faltan datos',
            text: 'Por favor, selecciona tu Grado y elige una Lista.',
            confirmButtonColor: '#1e3c72'
        });
        return;
    }
    
    const datosForm = new FormData(formulario); 

    boton.disabled = true;
    boton.textContent = 'Enviando voto... 📤';
    
    // Alerta de carga
    Swal.fire({
        title: 'Registrando voto...',
        text: 'Por favor, espera. Conectando con el servidor.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: datosForm
    })
    .then(response => {
        // Cerrar la alerta de carga
        Swal.close(); 
        
        return response.text().then(text => {
            if (response.ok) {
                return text;
            }
            throw new Error(text || 'Error de red o del servidor.');
        });
    })
    .then(mensaje => {
        // Alerta de éxito
        Swal.fire({
            icon: 'success',
            title: '¡Voto registrado!',
            html: `**${mensaje}** <br> Gracias por participar.`,
            confirmButtonText: 'Aceptar y Reiniciar',
            confirmButtonColor: '#00AEEF'
        }).then(() => {
            window.location.reload(); // Recargar al presionar Aceptar
        });
        
        bloquearFormulario();
    })
    .catch(error => {
        console.error('Error al enviar el voto:', error);
        
        // Alerta de error
        Swal.fire({
            icon: 'error',
            title: 'Error al registrar el voto',
            text: `Detalles: ${error.message || 'Intenta de nuevo.'}`,
            confirmButtonColor: '#E53935'
        });
        
        boton.disabled = false;
        boton.textContent = 'CONFIRMAR MI VOTO ANÓNIMO';
    });
}

function bloquearFormulario() {
    document.getElementById('grado').disabled = true;
    document.querySelectorAll('.swiper-slide').forEach(slide => slide.style.pointerEvents = 'none');
    boton.style.display = 'none';
    if (swiper) {
        swiper.disable();
    }
}