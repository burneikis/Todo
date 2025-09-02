import express from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

router.post('/todos/:todoId/categories/:categoryId', categoryController.addTodoToCategory);
router.delete('/todos/:todoId/categories/:categoryId', categoryController.removeTodoFromCategory);

export { router as categoriesRoutes };