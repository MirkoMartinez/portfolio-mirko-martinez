require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite procesar datos en formato JSON

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a la base de datos MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definición del Esquema y Modelo de Mongoose para los proyectos
const proyectoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    tecnologias: { type: [String], required: true },
    imagenUrl: { type: String, required: true },
    estado: { type: String, required: true, enum: ['Publicado', 'En desarrollo', 'Privado'] }
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

// RUTAS CRUD[cite: 8, 9]

// Consultar (GET): Obtener todos los proyectos
app.get('/api/proyectos', async (req, res) => {
    try {
        const proyectos = await Proyecto.find();
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener proyectos' });
    }
});

// Crear (POST): Registrar un nuevo proyecto
app.post('/api/proyectos', async (req, res) => {
    try {
        const nuevoProyecto = new Proyecto(req.body);
        await nuevoProyecto.save();
        res.status(201).json(nuevoProyecto);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el proyecto', error });
    }
});

// Modificar (PUT): Actualizar un proyecto existente
app.put('/api/proyectos/:id', async (req, res) => {
    try {
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(proyectoActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el proyecto' });
    }
});

// Eliminar (DELETE): Quitar un proyecto registrado
app.delete('/api/proyectos/:id', async (req, res) => {
    try {
        await Proyecto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Proyecto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el proyecto' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});