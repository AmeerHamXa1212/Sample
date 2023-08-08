import { Router } from 'express';
import bookRoutes from './book-routes';

const router = Router();

router.use(bookRoutes);

export default router;
