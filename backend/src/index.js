const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir la carpeta de imágenes subidas públicamente
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configuración de almacenamiento local con Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a la base de datos MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Esquema y Modelo de Mongoose
const proyectoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    tecnologias: [{ type: String }],
    imagenUrl: { type: String, required: true },
    estado: { type: String, required: true, enum: ['Publicado', 'En desarrollo', 'Privado'] }
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

// RUTAS API REST

// GET - Obtener todos los proyectos
app.get('/api/proyectos', async (req, res) => {
    try {
        const proyectos = await Proyecto.find();
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener proyectos', error });
    }
});

// POST - Crear proyecto con subida de archivo
app.post('/api/proyectos', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, descripcion, tecnologias, estado } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ mensaje: 'Es obligatorio adjuntar una imagen' });
        }

        const imagenUrl = `http://localhost:3000/uploads/${req.file.filename}`;

        const nuevoProyecto = new Proyecto({
            nombre,
            descripcion,
            tecnologias: typeof tecnologias === 'string' ? tecnologias.split(',').map(t => t.trim()) : tecnologias,
            imagenUrl,
            estado
        });

        await nuevoProyecto.save();
        res.status(201).json(nuevoProyecto);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear proyecto', error });
    }
});

// PUT - Actualizar proyecto existente
app.put('/api/proyectos/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, descripcion, tecnologias, estado, imagenUrlActual } = req.body;
        
        let imagenUrl = imagenUrlActual;
        if (req.file) {
            imagenUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        }

        const proyectoActualizado = await Proyecto.findByIdAndUpdate(
            req.params.id,
            {
                nombre,
                descripcion,
                tecnologias: typeof tecnologias === 'string' ? tecnologias.split(',').map(t => t.trim()) : tecnologias,
                imagenUrl,
                estado
            },
            { returnDocument: 'after' }
        );

        res.json(proyectoActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar proyecto', error });
    }
});

// DELETE - Eliminar proyecto
app.delete('/api/proyectos/:id', async (req, res) => {
    try {
        await Proyecto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Proyecto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar proyecto', error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});