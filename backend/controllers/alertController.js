global.alerts = global.alerts || [];

const getAlerts = async (req, res) => {
  const userAlerts = global.alerts.filter(a => a.user === req.user._id).reverse();
  res.json(userAlerts);
};

const markAlertAsRead = async (req, res) => {
  const alert = global.alerts.find(a => a._id === req.params.id);
  if (!alert) return res.status(404).json({ message: 'Alert not found' });
  if (alert.user !== req.user._id) return res.status(401).json({ message: 'Not authorized' });

  alert.isRead = true;
  res.json(alert);
};

module.exports = { getAlerts, markAlertAsRead };
