const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

router.post('/', orderController.createOrder);

router.get('/analytics/dates', orderController.getOrderDates);

router.get('/analytics/revenue', orderController.getRevenueAnalytics);

module.exports = router;