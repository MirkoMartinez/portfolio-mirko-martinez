const API_URL = 'http://localhost:3000/api/proyectos';

const gridProyectos = document.getElementById('grid-proyectos');
const formCrud = document.getElementById('crud-form');
const btnCancelar = document.getElementById('btn-cancelar');
const inputId = document.getElementById('proyecto-id');

document.addEventListener('DOMContentLoaded', cargarProyectos);

async function cargarProyectos() {
    try {
        const respuesta = await fetch(API_URL);
        const proyectos = await respuesta.json();
        
        gridProyectos.innerHTML = '';

        if (proyectos.length === 0) {
            gridProyectos.innerHTML = '<p class="mono muted">// Base de datos vacía.</p>';
            return;
        }

        proyectos.forEach(proyecto => {
            const article = document.createElement('article');
            article.classList.add('project-card');
            
            const techHTML = proyecto.tecnologias.map(t => `<span class="tag">${t}</span>`).join('');
            const techString = proyecto.tecnologias.join(', ');

            article.innerHTML = `
                <img src="${proyecto.imagenUrl}" alt="${proyecto.nombre}">
                <h3>${proyecto.nombre}</h3>
                <p class="muted">${proyecto.descripcion}</p>
                <div class="tags">${techHTML}</div>
                <p class="mono" style="margin-top:1rem;">Status: <span class="accent-text">${proyecto.estado}</span></p>
                <div class="card-actions">
                    <button class="btn btn-outline" onclick="prepararEdicion('${proyecto._id}', '${proyecto.nombre}', '${proyecto.descripcion}', '${techString}', '${proyecto.imagenUrl}', '${proyecto.estado}')">Edit()</button>
                    <button class="btn btn-danger" onclick="eliminarProyecto('${proyecto._id}')">Drop()</button>
                </div>
            `;
            gridProyectos.appendChild(article);
        });
    } catch (error) {
        gridProyectos.innerHTML = '<p style="color: #ef4444;" class="mono">Error de conexión con el backend.</p>';
    }
}

formCrud.addEventListener('submit', async (e) => {
    e.preventDefault();

    const proyectoData = {
        nombre: document.getElementById('titulo').value,
        descripcion: document.getElementById('descripcion').value,
        tecnologias: document.getElementById('tecnologias').value.split(',').map(tech => tech.trim()),
        imagenUrl: document.getElementById('imagenUrl').value,
        estado: document.getElementById('estado').value
    };

    const id = inputId.value;
    
    try {
        if (id) {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proyectoData)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proyectoData)
            });
        }
        
        limpiarFormulario();
        cargarProyectos();
    } catch (error) {
        console.error('Error al guardar:', error);
    }
});

async function eliminarProyecto(id) {
    if (confirm('¿Ejecutar instrucción DROP DATABASE? (Esta acción no se puede deshacer)')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            cargarProyectos();
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    }
}

function prepararEdicion(id, nombre, desc, tech, img, estado) {
    inputId.value = id;
    document.getElementById('titulo').value = nombre;
    document.getElementById('descripcion').value = desc;
    document.getElementById('tecnologias').value = tech;
    document.getElementById('imagenUrl').value = img;
    document.getElementById('estado').value = estado;
    
    document.getElementById('btn-guardar').textContent = 'Update (Actualizar)';
    btnCancelar.classList.remove('hidden');
    document.getElementById('gestion').scrollIntoView({ behavior: 'smooth' });
}

function limpiarFormulario() {
    formCrud.reset();
    inputId.value = '';
    document.getElementById('btn-guardar').textContent = 'Ejecutar (Guardar)';
    btnCancelar.classList.add('hidden');
}

btnCancelar.addEventListener('click', limpiarFormulario);