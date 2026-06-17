global.doctors = global.doctors || [
  { _id: '1', name: 'Dr. Sarah Smith', specialization: 'Cardiologist', experience: 15, contact: 'sarah@lifelink.com' },
  { _id: '2', name: 'Dr. John Doe', specialization: 'General Physician', experience: 10, contact: 'john@lifelink.com' },
  { _id: '3', name: 'Dr. Emily Chen', specialization: 'Pulmonologist', experience: 12, contact: 'emily@lifelink.com' },
];

const getDoctors = async (req, res) => {
  res.json(global.doctors);
};

const seedDoctors = async (req, res) => {
  res.status(201).json({ message: 'Doctors are already seeded in memory' });
};

module.exports = { getDoctors, seedDoctors };
