import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, Bell, Users, Settings, User, LogOut, Radio } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <Activity size={20} />, path: '/dashboard' },
    { name: 'Health Details', icon: <Activity size={20} />, path: '/health' },
    { name: 'Alerts', icon: <Bell size={20} />, path: '/alerts' },
    { name: 'Doctors', icon: <Users size={20} />, path: '/doctors' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    { name: 'Device Connection', icon: <Radio size={20} />, path: '/device' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Activity className="text-primary-500 mr-2" size={24} />
        <span className="text-xl font-bold text-slate-800 tracking-tight">LifeLink</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
