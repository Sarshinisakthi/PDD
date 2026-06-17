import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Calendar, Droplets, Edit2, Check, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ age: '', bloodGroup: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        age: user.age || '',
        bloodGroup: user.bloodGroup || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">User Profile</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-primary-600 h-32 relative">
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 transition text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium backdrop-blur-sm"
          >
            {isEditing ? <><Check size={16} className="mr-2"/> Save Profile</> : <><Edit2 size={16} className="mr-2"/> Edit Profile</>}
          </button>
        </div>
        <div className="px-8 pb-8 relative">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-md absolute -top-12">
            <span className="text-4xl font-bold text-primary-600">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-slate-800">{user?.name}</h3>
            <p className="text-slate-500 mt-1 flex items-center"><Mail size={16} className="mr-2" />{user?.email}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100">
            <div>
              <p className="text-sm text-slate-500 font-medium flex items-center mb-1"><Calendar size={16} className="mr-2" /> Age</p>
              {isEditing ? (
                <input 
                  type="number" 
                  value={formData.age} 
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary-500" 
                  placeholder="e.g. 28"
                />
              ) : (
                <p className="text-lg font-semibold text-slate-800">{user?.age || 'Not specified'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium flex items-center mb-1"><Droplets size={16} className="mr-2" /> Blood Group</p>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.bloodGroup} 
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary-500" 
                  placeholder="e.g. O+"
                />
              ) : (
                <p className="text-lg font-semibold text-slate-800">{user?.bloodGroup || 'Not specified'}</p>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2 mr-2">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
