// src/controllers/OrderController.js
import { createOrderWithTransaction, InsufficientStockError } from '../services/OrderService.js';

export async function createOrderController(req, res) {
    const orderData = req.body; 

    try {
        const newOrder = await createOrderWithTransaction(orderData);

        res.status(201).json({
            message: 'Замовлення успішно створено та запаси оновлено.',
            order: newOrder,
        });

    } catch (error) {
        if (error instanceof InsufficientStockError) {
            return res.status(400).json({ 
                error: 'InsufficientStock',
                message: error.message 
            });
        }
        
        console.error('Помилка при створенні замовлення:', error);
        res.status(500).json({ 
            error: 'ServerError',
            message: 'Не вдалося створити замовлення через внутрішню помилку. Перевірте, чи існують client_id, address_id, worker_id.',
            details: error.message
        });
    }
}