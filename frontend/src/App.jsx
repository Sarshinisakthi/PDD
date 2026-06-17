import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Layout
import Layout from './components/Layout';

// Pages
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HealthDetails from './pages/HealthDetails';
import Alerts from './pages/Alerts';
import Doctors from './pages/Doctors';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DeviceConnection from './pages/DeviceConnection';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes wrapped in Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/health" element={<HealthDetails />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/device" element={<DeviceConnection />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
