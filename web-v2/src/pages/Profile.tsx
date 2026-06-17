import { useAuthStore } from '../store/authStore';
import { User, Mail } from 'lucide-react';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your personal information</p>
      </div>

      <div className="glass-card p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-dark-border">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{user?.displayName || 'Unknown User'}</h2>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" defaultValue={user?.displayName || ''} className="input-field pl-11 bg-slate-50 dark:bg-white/5 opacity-70 cursor-not-allowed" readOnly />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" defaultValue={user?.email || ''} className="input-field pl-11 bg-slate-50 dark:bg-white/5 opacity-70 cursor-not-allowed" readOnly />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="button" className="btn-primary" disabled>
              Update Profile (Coming Soon)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
