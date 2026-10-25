const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Para validar y recibir datos básicos en JSON[cite: 9]

// Simulación de Base de Datos temporal (Aquí conectarías Mongoose/MongoDB)
let proyectosDB = []; 

// GET: Consultar y mostrar proyectos[cite: 8, 9]
app.get('/api/proyectos', (req, res) => {
    res.json(proyectosDB);
});

// POST: Crear y registrar un nuevo proyecto[cite: 8, 9]
app.post('/api/proyectos', (req, res) => {
    const nuevoProyecto = req.body;
    // Validar datos básicos[cite: 9]
    if(!nuevoProyecto.nombre || !nuevoProyecto.descripcion) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    nuevoProyecto.id = Date.now().toString();
    proyectosDB.push(nuevoProyecto);
    res.status(201).json(nuevoProyecto);
});

// PUT/PATCH: Modificar un proyecto existente[cite: 8, 9]
app.put('/api/proyectos/:id', (req, res) => {
    const index = proyectosDB.findIndex(p => p.id === req.params.id);
    if(index !== -1) {
        proyectosDB[index] = { ...proyectosDB[index], ...req.body };
        res.json(proyectosDB[index]);
    } else {
        res.status(404).json({ error: 'Proyecto no encontrado' });
    }
});

// DELETE: Eliminar un proyecto[cite: 8, 9]
app.delete('/api/proyectos/:id', (req, res) => {
    proyectosDB = proyectosDB.filter(p => p.id !== req.params.id);
    res.json({ mensaje: 'Proyecto eliminado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor intermediario corriendo en http://localhost:${PORT}`);
});