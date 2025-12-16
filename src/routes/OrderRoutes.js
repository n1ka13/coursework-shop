import { Router } from 'express';
import { createOrderController } from '../controllers/OrderController.js';

const router = Router();

router.post('/orders', createOrderController);

export default router;