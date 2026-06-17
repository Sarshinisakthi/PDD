const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  heartRate: {
    type: Number,
    required: true,
  },
  spO2: {
    type: Number,
    required: true,
  },
  bloodPressure: {
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true }
  },
  temperature: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

const HealthData = mongoose.model('HealthData', healthDataSchema);
module.exports = HealthData;
