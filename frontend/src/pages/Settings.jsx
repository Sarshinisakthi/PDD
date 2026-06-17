import { useState } from 'react';
import { Bell, Shield, Smartphone, Globe, Moon } from 'lucide-react';

const SettingsSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const ToggleRow = ({ label, description, state, setState }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 last:pb-0 first:pt-0">
    <div className="pr-4">
      <p className="font-medium text-slate-800">{label}</p>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
    <button 
      onClick={() => setState(!state)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${state ? 'bg-primary-500' : 'bg-slate-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${state ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const Settings = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="max-w-4xl space-y-6 pb-10">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Account Settings</h2>
      
      <SettingsSection title="Notifications & Alerts" icon={Bell}>
        <ToggleRow 
          label="Email Notifications" 
          description="Receive weekly health summaries and doctor appointment reminders via email."
          state={emailNotifs} setState={setEmailNotifs} 
        />
        <ToggleRow 
          label="Push Notifications" 
          description="Receive instant alerts on your phone when your vitals drop below normal."
          state={pushNotifs} setState={setPushNotifs} 
        />
        <ToggleRow 
          label="Emergency Health Alerts" 
          description="Automatically notify emergency contacts if critical health events are detected."
          state={healthAlerts} setState={setHealthAlerts} 
        />
      </SettingsSection>

      <SettingsSection title="Privacy & Security" icon={Shield}>
        <ToggleRow 
          label="Share Data with Doctors" 
          description="Allow doctors you book appointments with to view your historical health data."
          state={dataSharing} setState={setDataSharing} 
        />
        <ToggleRow 
          label="Two-Factor Authentication (2FA)" 
          description="Require an extra security code when logging into your account."
          state={twoFactor} setState={setTwoFactor} 
        />
        <div className="pt-4 mt-4 border-t border-slate-100">
          <button className="text-red-600 font-medium hover:text-red-700 text-sm">Delete Account & Data</button>
        </div>
      </SettingsSection>

      <SettingsSection title="App Preferences" icon={Smartphone}>
        <ToggleRow 
          label="Dark Mode (Beta)" 
          description="Switch the dashboard interface to a darker theme for night viewing."
          state={darkMode} setState={setDarkMode} 
        />
        <div className="flex items-center justify-between py-4 border-t border-slate-50 mt-2">
          <div>
            <p className="font-medium text-slate-800">Language</p>
            <p className="text-sm text-slate-500 mt-1">Select your preferred dashboard language.</p>
          </div>
          <select className="border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary-500 text-sm">
            <option>English (US)</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </div>
      </SettingsSection>
    </div>
  );
};

export default Settings;
