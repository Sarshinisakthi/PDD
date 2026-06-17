global.healthData = global.healthData || [];
global.alerts = global.alerts || [];

const simulateDeviceData = async (req, res) => {
  const heartRate = Math.floor(Math.random() * (120 - 50 + 1)) + 50;
  const spO2 = Math.floor(Math.random() * (100 - 90 + 1)) + 90;
  const systolic = Math.floor(Math.random() * (140 - 90 + 1)) + 90;
  const diastolic = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
  const temperature = parseFloat((Math.random() * (101 - 97) + 97).toFixed(1));

  const newData = {
    _id: Date.now().toString(),
    user: req.user._id,
    heartRate, spO2, bloodPressure: { systolic, diastolic }, temperature,
    createdAt: new Date()
  };
  global.healthData.push(newData);

  const checkAlert = (condition, type, message) => {
    if (condition) {
      global.alerts.push({
        _id: Math.random().toString(),
        user: req.user._id,
        type, message, isRead: false,
        createdAt: new Date()
      });
    }
  };

  checkAlert(heartRate > 100 || heartRate < 60, 'Heart Rate', `Abnormal heart rate: ${heartRate} bpm`);
  checkAlert(spO2 < 95, 'SpO2', `Low oxygen levels: ${spO2}%`);
  checkAlert(temperature > 99.5 || temperature < 96.0, 'Temperature', `Abnormal body temperature: ${temperature}°F`);
  checkAlert(systolic > 130 || diastolic > 85, 'Blood Pressure', `High blood pressure: ${systolic}/${diastolic} mmHg`);

  res.status(201).json(newData);
};

module.exports = { simulateDeviceData };
