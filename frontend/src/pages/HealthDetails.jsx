import { useState, useEffect } from 'react';
import api from '../services/api';
import { Activity, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HealthDetails = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const { data } = await api.get('/health');
        
        // Format history for table and chart
        const formattedHistory = data.map(item => ({
          ...item,
          timeLabel: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dateLabel: new Date(item.createdAt).toLocaleDateString(),
          systolic: item.bloodPressure?.systolic || 0,
          diastolic: item.bloodPressure?.diastolic || 0,
        })).reverse(); // Reverse so oldest is first for chart progression

        setHistoryData(formattedHistory);
      } catch (error) {
        console.error('Error fetching health history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthData();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Activity className="animate-spin text-primary-500" size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Advanced Health Analytics</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="text-primary-600" />
          <h3 className="text-lg font-semibold text-slate-800">Historical Vitals Trend</h3>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorO2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="heartRate" stroke="#e11d48" fillOpacity={1} fill="url(#colorHeart)" name="Heart Rate (bpm)" strokeWidth={2} />
              <Area type="monotone" dataKey="spO2" stroke="#0284c7" fillOpacity={1} fill="url(#colorO2)" name="Blood Oxygen (%)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <Calendar className="text-primary-600" />
          <h3 className="text-lg font-semibold text-slate-800">Detailed Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-medium">
              <tr>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Heart Rate</th>
                <th className="px-6 py-4">Blood Oxygen</th>
                <th className="px-6 py-4">Blood Pressure</th>
                <th className="px-6 py-4">Temperature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...historyData].reverse().map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {entry.dateLabel} <span className="text-slate-400 font-normal ml-1">{entry.timeLabel}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entry.heartRate > 100 || entry.heartRate < 60 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {entry.heartRate} bpm
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entry.spO2 < 95 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {entry.spO2}%
                    </span>
                  </td>
                  <td className="px-6 py-4">{entry.systolic}/{entry.diastolic} mmHg</td>
                  <td className="px-6 py-4">{entry.temperature} °F</td>
                </tr>
              ))}
            </tbody>
          </table>
          {historyData.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No historical data logs available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthDetails;
