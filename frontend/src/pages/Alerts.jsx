import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await api.get('/alerts');
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/alerts/${id}/read`);
      setAlerts(alerts.map(a => a._id === id ? { ...a, isRead: true } : a));
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
        <Bell className="mr-2" /> Notifications & Alerts
      </h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No alerts found.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <li key={alert._id} className={`p-4 flex items-start ${alert.isRead ? 'bg-white' : 'bg-rose-50'}`}>
                <div className={`mt-1 mr-4 ${alert.isRead ? 'text-slate-400' : 'text-rose-500'}`}>
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${alert.isRead ? 'text-slate-700' : 'text-rose-800'}`}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
                {!alert.isRead && (
                  <button 
                    onClick={() => markAsRead(alert._id)}
                    className="ml-4 text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Alerts;
