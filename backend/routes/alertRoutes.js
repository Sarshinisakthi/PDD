const express = require('express');
const router = express.Router();
const { getAlerts, markAlertAsRead } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAlerts);
router.put('/:id/read', protect, markAlertAsRead);

module.exports = router;
