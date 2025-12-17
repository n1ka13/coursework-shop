const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');

router.get('/analytics/roles', workerController.getRoleStats);

router.get('/analytics/pairs', workerController.getWorkerClientPairs);

module.exports = router;