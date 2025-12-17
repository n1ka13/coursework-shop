const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/analytics/orders', clientController.getClientStats);

router.get('/analytics/counts', clientController.getOrdersCount);

module.exports = router;