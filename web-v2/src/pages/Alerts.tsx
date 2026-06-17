import { useEffect, useState } from 'react';
import { fetchAlerts, markAlertRead } from '../services/api';
import { Bell, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const data = await fetchAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markAlertRead(id);
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      toast.error('Failed to update alert');
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications & Alerts</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">System generated health warnings</p>
      </div>

      <div className="glass-card overflow-hidden">
        {alerts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p>No alerts found. You're in good health!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-dark-border">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-5 flex items-start gap-4 transition-colors ${!alert.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                <div className={`mt-1 p-2 rounded-full ${
                  alert.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                  alert.severity === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-sm font-semibold ${!alert.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                      {alert.alert_type}
                    </p>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{alert.message}</p>
                </div>
                {!alert.is_read && (
                  <button
                    onClick={() => handleMarkRead(alert.id)}
                    className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-full transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
