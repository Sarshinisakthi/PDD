import { useState, useEffect } from 'react';
import api from '../services/api';
import { Activity, Heart, Thermometer, Droplet, Wind } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VitalCard = ({ title, value, unit, icon: Icon, colorClass, status }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <div className="flex items-baseline">
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <span className="ml-1 text-sm font-medium text-slate-500">{unit}</span>
      </div>
      <p className={`mt-2 text-xs font-medium ${status === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>
        {status}
      </p>
    </div>
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const [latestData, setLatestData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHealthData = async () => {
    try {
      const [latestRes, historyRes] = await Promise.all([
        api.get('/health/latest'),
        api.get('/health')
      ]);
      setLatestData(latestRes.data);
      
      // Format history for chart
      const formattedHistory = historyRes.data.reverse().map(item => ({
        time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        heartRate: item.heartRate,
        spO2: item.spO2,
      }));
      setHistoryData(formattedHistory);
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    // Poll every 5 seconds for simulated real-time data
    const interval = setInterval(fetchHealthData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !latestData) {
    return <div className="flex justify-center py-10"><Activity className="animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Health Dashboard</h2>
      </div>

      {latestData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <VitalCard 
              title="Heart Rate" 
              value={latestData.heartRate} 
              unit="bpm" 
              icon={Heart}
              colorClass="bg-rose-100 text-rose-600"
              status={latestData.heartRate > 100 || latestData.heartRate < 60 ? 'Abnormal' : 'Normal'}
            />
            <VitalCard 
              title="Oxygen Level" 
              value={latestData.spO2} 
              unit="%" 
              icon={Wind}
              colorClass="bg-blue-100 text-blue-600"
              status={latestData.spO2 < 95 ? 'Low' : 'Normal'}
            />
            <VitalCard 
              title="Blood Pressure" 
              value={`${latestData.bloodPressure.systolic}/${latestData.bloodPressure.diastolic}`} 
              unit="mmHg" 
              icon={Droplet}
              colorClass="bg-purple-100 text-purple-600"
              status={latestData.bloodPressure.systolic > 130 ? 'High' : 'Normal'}
            />
            <VitalCard 
              title="Body Temperature" 
              value={latestData.temperature} 
              unit="°F" 
              icon={Thermometer}
              colorClass="bg-orange-100 text-orange-600"
              status={latestData.temperature > 99.5 ? 'High' : 'Normal'}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Live Vitals Trend</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="heartRate" stroke="#e11d48" strokeWidth={3} dot={false} activeDot={{ r: 8 }} name="Heart Rate" />
                  <Line type="monotone" dataKey="spO2" stroke="#0284c7" strokeWidth={3} dot={false} name="SpO2 %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Activity className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-slate-900">No data available</h3>
          <p className="text-slate-500 mt-1">Connect your device to start monitoring.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
