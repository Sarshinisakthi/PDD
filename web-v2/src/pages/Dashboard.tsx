import { useEffect, useState } from 'react';
import { fetchLatestVitals, fetchHealthHistory, simulateVitals } from '../services/api';
import VitalCard from '../components/VitalCard';
import { Heart, Droplets, Activity, Thermometer, Play, Square, Loader2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [latest, setLatest] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [histData, latestData] = await Promise.all([fetchHealthHistory(), fetchLatestVitals()]);
      setHistory(histData.reverse()); // chronological order for charts
      setLatest(latestData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(async () => {
        try {
          const newData = await simulateVitals();
          setLatest(newData);
          setHistory(prev => [...prev.slice(-49), newData]); // keep last 50
        } catch (err) {
          toast.error('Simulation failed');
          setIsSimulating(false);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Health Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time vitals monitoring and analysis</p>
        </div>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all ${
            isSimulating ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
          } shadow-lg active:scale-95`}
        >
          {isSimulating ? <Square size={18} /> : <Play size={18} />}
          {isSimulating ? 'Stop Simulation' : 'Start IoT Simulation'}
        </button>
      </div>

      {latest ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <VitalCard
            title="Heart Rate" value={latest.heart_rate} unit="bpm" icon={Heart}
            status={latest.heart_rate > 100 || latest.heart_rate < 60 ? 'danger' : 'normal'}
            gradient="from-rose-500 to-pink-500" iconBg="bg-rose-500"
          />
          <VitalCard
            title="Oxygen Level" value={latest.spo2} unit="%" icon={Droplets}
            status={latest.spo2 < 95 ? 'danger' : 'normal'}
            gradient="from-blue-500 to-cyan-500" iconBg="bg-blue-500"
          />
          <VitalCard
            title="Blood Pressure" value={`${latest.blood_pressure_systolic}/${latest.blood_pressure_diastolic}`} unit="mmHg" icon={Activity}
            status={latest.blood_pressure_systolic > 130 ? 'warning' : 'normal'}
            gradient="from-purple-500 to-indigo-500" iconBg="bg-purple-500"
          />
          <VitalCard
            title="Body Temp" value={latest.temperature} unit="°F" icon={Thermometer}
            status={latest.temperature > 99.5 ? 'warning' : 'normal'}
            gradient="from-amber-500 to-orange-500" iconBg="bg-amber-500"
          />
        </div>
      ) : (
        <div className="glass-card p-8 text-center">
          <p className="text-slate-500">No data available. Start the simulation to begin tracking.</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Heart Rate Chart */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Heart Rate Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="recorded_at" tickFormatter={(v) => new Date(v).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} stroke="#64748b" fontSize={12} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1B2238', borderColor: '#2d3748', color: '#fff', borderRadius: '8px' }}
                    labelFormatter={(v) => new Date(v).toLocaleString()}
                  />
                  <Line type="monotone" dataKey="heart_rate" stroke="#ec4899" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SpO2 Chart */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Oxygen Level (SpO2)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="recorded_at" tickFormatter={(v) => new Date(v).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} stroke="#64748b" fontSize={12} />
                  <YAxis domain={[90, 100]} stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1B2238', borderColor: '#2d3748', color: '#fff', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="spo2" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorSpo2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
