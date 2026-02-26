import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', listProducts);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;