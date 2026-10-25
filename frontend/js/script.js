const API_URL = 'http://localhost:3000/api/proyectos';
const gridProyectos = document.getElementById('grid-proyectos');

const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
    cargarProyectos();
});

async function cargarProyectos() {
    try {
        const respuesta = await fetch(API_URL);
        const proyectos = await respuesta.json();
        
        gridProyectos.innerHTML = '';

        if (proyectos.length === 0) {
            gridProyectos.innerHTML = '<p class="mono muted">// No hay proyectos publicados actualmente.</p>';
            return;
        }

        proyectos.forEach(proyecto => {
            // Solo muestra los proyectos si no están en estado "Privado"
            if (proyecto.estado !== 'Privado') {
                const article = document.createElement('article');
                article.classList.add('project-card', 'fade-in');
                
                const techHTML = proyecto.tecnologias.map(t => `<span class="tag">${t}</span>`).join('');

                article.innerHTML = `
                    <img src="${proyecto.imagenUrl}" alt="${proyecto.nombre}">
                    <h3>${proyecto.nombre}</h3>
                    <p class="muted">${proyecto.descripcion}</p>
                    <div class="tags">${techHTML}</div>
                    <p class="mono" style="margin-top:1rem;">Status: <span class="accent-text">${proyecto.estado}</span></p>
                `;
                gridProyectos.appendChild(article);
                setTimeout(() => fadeObserver.observe(article), 50);
            }
        });
    } catch (error) {
        gridProyectos.innerHTML = '<p style="color: #ef4444;" class="mono">Error de conexión (ERR_CONNECTION_REFUSED).</p>';
    }
}

const formContacto = document.getElementById('contact-form');
formContacto.addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('form-message').innerHTML = `<p class="mono accent-text" style="margin-top:1rem;">> Mensaje enviado con éxito. Código 200 OK.</p>`;
    formContacto.reset();
});