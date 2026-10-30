const API_URL = 'http://localhost:3000/api/proyectos';

const gridProyectos = document.getElementById('grid-proyectos');
const formCrud = document.getElementById('crud-form');
const btnCancelar = document.getElementById('btn-cancelar');
const inputId = document.getElementById('proyecto-id');
const inputImagenActual = document.getElementById('imagenUrlActual');
const imagenFileInput = document.getElementById('imagenFile');
const imagenInfo = document.getElementById('imagen-info');

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

    const id = inputId.value;
    const formData = new FormData();

    formData.append('nombre', document.getElementById('titulo').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('tecnologias', document.getElementById('tecnologias').value);
    formData.append('estado', document.getElementById('estado').value);

    if (imagenFileInput.files[0]) {
        formData.append('imagen', imagenFileInput.files[0]);
    } else if (inputImagenActual.value) {
        formData.append('imagenUrlActual', inputImagenActual.value);
    }

    try {
        if (id) {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                body: formData
            });
        } else {
            if (!imagenFileInput.files[0]) {
                alert('Por favor selecciona una imagen para el nuevo proyecto.');
                return;
            }
            await fetch(API_URL, {
                method: 'POST',
                body: formData
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
    inputImagenActual.value = img;
    document.getElementById('titulo').value = nombre;
    document.getElementById('descripcion').value = desc;
    document.getElementById('tecnologias').value = tech;
    document.getElementById('estado').value = estado;
    
    imagenInfo.textContent = `// Imagen actual guardada. (Selecciona un archivo si deseas reemplazarla)`;
    document.getElementById('btn-guardar').textContent = 'Update (Actualizar)';
    btnCancelar.classList.remove('hidden');
    document.getElementById('gestion').scrollIntoView({ behavior: 'smooth' });
}

function limpiarFormulario() {
    formCrud.reset();
    inputId.value = '';
    inputImagenActual.value = '';
    imagenInfo.textContent = '// Selecciona una imagen desde tu PC';
    document.getElementById('btn-guardar').textContent = 'Ejecutar (Guardar)';
    btnCancelar.classList.add('hidden');
}

btnCancelar.addEventListener('click', limpiarFormulario);