const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const user = global.users?.find(u => u._id === decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      // Ignore token errors and fallback to mock user
    }
  }
  
  // Fallback: Attach a mock user to allow seamless preview without logging in
  req.user = { 
    _id: 'mock_user_1', 
    name: 'Umadevi', 
    email: 'sarshinisakthi26@gmail.com',
    age: 28,
    bloodGroup: 'O+'
  };
  next();
};

module.exports = { protect };
