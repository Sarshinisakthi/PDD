import { useState } from 'react';
import api from '../services/api';
import { Radio, Power, Activity } from 'lucide-react';

const DeviceConnection = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const startSimulation = () => {
    setIsSimulating(true);
    // Send one immediately
    api.post('/device/simulate');
    // Then every 5 seconds
    const id = setInterval(() => {
      api.post('/device/simulate');
    }, 5000);
    setIntervalId(id);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Device Connection</h2>
      
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
        <div className="relative inline-block mb-6">
          <div className={`absolute inset-0 rounded-full ${isSimulating ? 'bg-primary-400 animate-ping opacity-75' : 'bg-slate-200'}`}></div>
          <div className="relative w-24 h-24 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-lg">
            <Radio className={isSimulating ? 'text-primary-500' : 'text-slate-400'} size={40} />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          {isSimulating ? 'Device Connected & Transmitting' : 'Device Disconnected'}
        </h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Simulate a connected IoT health monitoring device. When active, it will generate and transmit random vital signs to the server every 5 seconds.
        </p>

        {isSimulating ? (
          <button
            onClick={stopSimulation}
            className="inline-flex items-center px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-xl transition-colors"
          >
            <Power className="mr-2" size={20} />
            Stop Simulation
          </button>
        ) : (
          <button
            onClick={startSimulation}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 font-semibold rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            <Activity className="mr-2" size={20} />
            Start Simulation
          </button>
        )}
      </div>
    </div>
  );
};

export default DeviceConnection;
