const express = require('express');
const router = express.Router();
const { addHealthData, getHealthData, getLatestHealthData } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addHealthData)
  .get(protect, getHealthData);

router.get('/latest', protect, getLatestHealthData);

module.exports = router;
