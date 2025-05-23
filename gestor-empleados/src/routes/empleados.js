const router = require('express').Router();
const {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar,
  calificar,
  exportarCalificacionCSV,
  exportarTodasCalificacionesCSV,
  listarCalificaciones
} = require('../controllers/empleadosController');

router.post('/', crear);
router.get('/', listar);
router.get('/:id', obtener);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);
router.post('/:id/calificacion', calificar);
router.get('/calificaciones/csv', exportarTodasCalificacionesCSV);
router.get('/:id/calificaciones', listarCalificaciones);

module.exports = router;