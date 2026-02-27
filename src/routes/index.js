import { Router } from 'express';

import authRoutes from './auth.routes.js';
import productsRoutes from './products.routes.js';
import publicRoutes from './public.routes.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use('/auth', authRoutes);

router.get('/admin/ping', requireAuth, requireAdmin, (req, res) => {
  res.json({ message: 'Admin access OK ✅', user: req.user });
});

router.use('/products', productsRoutes);
router.use('/public', publicRoutes);

export default router;