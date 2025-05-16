const express = require('express');
const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Importar rutas
const empleadosRoutes = require('./routes/empleados');
const cargosRoutes = require('./routes/cargos');
const authRoutes = require('./routes/auth');

// Usar rutas
app.use('/api/empleados', empleadosRoutes);
app.use('/api/cargos', cargosRoutes);
app.use('/api/auth', authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});