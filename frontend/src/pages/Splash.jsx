import { Link } from 'react-router-dom';
import { Activity, HeartPulse } from 'lucide-react';

const Splash = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary-500"></div>
        
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <HeartPulse className="text-primary-600" size={40} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">LifeLink</h1>
        <p className="text-slate-500 mb-8 font-medium">Smart Health Monitoring System</p>
        
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="block w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-all duration-200"
          >
            Create Account
          </Link>
        </div>
      </div>
      <p className="mt-8 text-sm text-slate-500 font-medium">&copy; 2026 LifeLink Technologies</p>
    </div>
  );
};

export default Splash;
