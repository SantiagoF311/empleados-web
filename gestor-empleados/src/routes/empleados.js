import { Router } from 'express';
const router = Router();
import { obtenerTodos, crearEmpleado, obtenerPorId, actualizarEmpleado, eliminarEmpleado, obtenerPorCargo } from '../controllers/empleadosController';
import { verificarToken } from '../controllers/authController';

router.get('/', obtenerTodos);
router.post('/', verificarToken, crearEmpleado);
router.get('/:id', obtenerPorId);
router.put('/:id', verificarToken, actualizarEmpleado);
router.delete('/:id', verificarToken, eliminarEmpleado);
router.get('/por-cargo/:cargoId', obtenerPorCargo);

export default router;