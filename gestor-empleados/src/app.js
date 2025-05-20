const express = require('express');
const app = express();

app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth');
const cargosRoutes = require('./routes/cargos');
const empleadosRoutes = require('./routes/empleados');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/cargos', cargosRoutes);
app.use('/api/empleados', empleadosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Iniciar servidor
app.listen(5000, () => {
  console.log('Servidor en http://localhost:5000');
});