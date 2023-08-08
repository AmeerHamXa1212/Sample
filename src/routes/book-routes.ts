import { Router } from 'express';
import * as bookController from '../controllers';

const router = Router();

router.get('/books', bookController.getAllBooks);
router.get('/books/:id', bookController.getBookById);
router.post('/books', bookController.createBook);
router.put('/books/:id', bookController.updateBookbyID);
router.delete('/books/:id', bookController.deleteBook);

export default router;
