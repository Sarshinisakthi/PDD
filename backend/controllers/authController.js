const jwt = require('jsonwebtoken');

// IN-MEMORY MOCK DB
global.users = global.users || [];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, age, bloodGroup } = req.body;
  const userExists = global.users.find(u => u.email === email);

  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = {
    _id: Date.now().toString(),
    name, email, password, age, bloodGroup
  };
  global.users.push(user);

  // Seed initial health data for the new user
  global.healthData = global.healthData || [];
  const now = Date.now();
  for (let i = 10; i >= 0; i--) {
    global.healthData.push({
      _id: (now - i * 5000).toString(),
      user: user._id,
      heartRate: Math.floor(Math.random() * (90 - 70 + 1)) + 70, // 70-90
      spO2: Math.floor(Math.random() * (100 - 96 + 1)) + 96, // 96-100
      bloodPressure: { systolic: 120, diastolic: 80 },
      temperature: parseFloat((Math.random() * (98.6 - 97.5) + 97.5).toFixed(1)),
      createdAt: new Date(now - i * 5000)
    });
  }

  global.alerts = global.alerts || [];
  global.alerts.push({
    _id: Date.now().toString(),
    user: user._id,
    type: 'System',
    message: 'Welcome to LifeLink! Connect your device to start live monitoring.',
    isRead: false,
    createdAt: new Date()
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = global.users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const getMe = async (req, res) => {
  const user = global.users.find(u => u._id === req.user._id);
  res.json(user || req.user);
};

const updateProfile = async (req, res) => {
  const { age, bloodGroup, name } = req.body;
  const userIndex = global.users.findIndex(u => u._id === req.user._id);
  
  if (userIndex !== -1) {
    if (age) global.users[userIndex].age = age;
    if (bloodGroup) global.users[userIndex].bloodGroup = bloodGroup;
    if (name) global.users[userIndex].name = name;
    res.json(global.users[userIndex]);
  } else {
    // If it's the mock user, just return the mocked update
    res.json({ ...req.user, age, bloodGroup, name });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };
