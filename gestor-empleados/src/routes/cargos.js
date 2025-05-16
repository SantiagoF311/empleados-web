import { Router } from 'express';
const router = Router();
import { obtenerTodos, crearCargo, obtenerPorId, actualizarCargo, eliminarCargo } from '../controllers/cargosController';
import { verificarToken } from '../controllers/authController';

router.get('/', obtenerTodos);
router.post('/', verificarToken, crearCargo);
router.get('/:id', obtenerPorId);
router.put('/:id', verificarToken, actualizarCargo);
router.delete('/:id', verificarToken, eliminarCargo);

export default router;