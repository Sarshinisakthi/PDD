global.healthData = global.healthData || [];
global.alerts = global.alerts || [];

const addHealthData = async (req, res) => {
  const { heartRate, spO2, bloodPressure, temperature } = req.body;
  const newData = {
    _id: Date.now().toString(),
    user: req.user._id,
    heartRate, spO2, bloodPressure, temperature,
    createdAt: new Date()
  };
  global.healthData.push(newData);
  res.status(201).json(newData);
};

const getHealthData = async (req, res) => {
  const data = global.healthData.filter(d => d.user === req.user._id).reverse().slice(0, 50);
  res.json(data);
};

const getLatestHealthData = async (req, res) => {
  const data = global.healthData.filter(d => d.user === req.user._id);
  res.json(data[data.length - 1] || null);
};

module.exports = { addHealthData, getHealthData, getLatestHealthData };
