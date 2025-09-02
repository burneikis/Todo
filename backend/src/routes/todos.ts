import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getTodos,
  getTodo,
  createNewTodo,
  updateExistingTodo,
  deleteTodoById,
  toggleTodo
} from '../controllers/todoController';

const router = Router();

router.use(authenticateToken);

router.get('/', getTodos);
router.post('/', createNewTodo);
router.get('/:id', getTodo);
router.put('/:id', updateExistingTodo);
router.delete('/:id', deleteTodoById);
router.patch('/:id/toggle', toggleTodo);

export default router;