const express = require('express');
const router = express.Router();
const { simulateDeviceData } = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/simulate', protect, simulateDeviceData);

module.exports = router;
