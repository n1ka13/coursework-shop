const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/analytics/categories', productController.getCategoryStats);

router.get('/analytics/never-ordered', productController.getNeverOrdered);

router.get('/analytics/avg-prices', productController.getAvgPrices);

router.get('/analytics/premium', productController.getPremiumProducts);

router.delete("/:id", productController.softDeleteProduct);

router.patch("/:id/restore", productController.restoreProduct);

module.exports = router;