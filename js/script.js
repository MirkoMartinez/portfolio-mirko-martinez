// Selección de elementos del DOM
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const inputs = document.querySelectorAll('input, textarea');

// Evento submit para validar el formulario
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue

    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    
    let formularioValido = true;

    // Limpiar mensajes y clases previas
    formMessage.innerHTML = '';
    inputs.forEach(input => input.classList.remove('error-input'));

    // Estructura de control para validación
    if (nombre.value.trim() === '') {
        nombre.classList.add('error-input'); // Modifica clases del DOM
        formularioValido = false;
    }
    
    if (email.value.trim() === '') {
        email.classList.add('error-input');
        formularioValido = false;
    }
    
    if (mensaje.value.trim() === '') {
        mensaje.classList.add('error-input');
        formularioValido = false;
    }

    // Respuesta según validación
    if (formularioValido) {
        // Crear elemento en el DOM
        const pExito = document.createElement('p');
        pExito.textContent = `¡Gracias por tu mensaje, ${nombre.value}! Me pondré en contacto pronto.`;
        pExito.classList.add('mensaje-exito');
        formMessage.appendChild(pExito);
        
        // Reiniciar los campos del formulario
        form.reset();
    } else {
        const pError = document.createElement('p');
        pError.textContent = 'Por favor, completa todos los campos marcados en rojo.';
        pError.classList.add('mensaje-error');
        formMessage.appendChild(pError);
    }
});

// Evento input para quitar la clase de error en tiempo real
inputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.classList.remove('error-input');
        }
    });
});