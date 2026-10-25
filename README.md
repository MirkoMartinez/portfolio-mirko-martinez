# Portfolio - Mirko Martinez

**Descripción:**
Portfolio web personal desarrollado como actividad integradora de las Unidades 3, 4, 5 y 6[cite: 8]. Este proyecto full-stack presenta mi información académica, experiencia como Community Manager y desarrollador, e incorpora un sistema backend con persistencia de datos para gestionar dinámicamente la sección de proyectos[cite: 8].

**Tecnologías utilizadas:**
- **Frontend:** HTML5 (estructuración semántica), CSS3 (Flexbox, CSS Grid y Media Queries) y JavaScript (manipulación del DOM, validación de formularios y consumo de API con Fetch)[cite: 8].
- **Backend:** Node.js y Express para la creación del servidor, enrutamiento y procesamiento de peticiones HTTP[cite: 9].
- **Base de Datos:** MongoDB (NoSQL) para el almacenamiento y persistencia de la información de los proyectos[cite: 9].
- **TypeScript:** Implementado de forma acotada para el tipado estático y la estructuración segura de los modelos de datos[cite: 9].

**Principales funcionalidades:**
- Diseño adaptable a dispositivos móviles y escritorio.
- Formulario de contacto interactivo que valida campos vacíos y genera mensajes dinámicos sin recargar la página.
- **Gestión de Proyectos (CRUD):** Sistema completo para consultar (GET), registrar (POST), actualizar (PUT/PATCH) y eliminar (DELETE) proyectos directamente desde la interfaz hacia la base de datos[cite: 8, 9].
- Arquitectura escalable con separación clara entre cliente (Frontend) y servidor (Backend)[cite: 9].

## Instrucciones de Instalación y Ejecución

**1. Clonar el proyecto**
`git clone [https://github.com/MirkoMartinez/portfolio-mirko-martinez.git]`

**2. Configuración de Base de Datos**
Crear un archivo `.env` en la carpeta `backend` con la variable `MONGO_URI=tu_string_de_conexion`.

**3. Ejecutar el Backend**
Navegar a la carpeta `backend`: `cd backend`
Instalar dependencias: `npm install`
Iniciar servidor: `node src/server.js`

**4. Ejecutar el Frontend**
Abrir el archivo `frontend/index.html` en el navegador (se recomienda usar Live Server).