import { useState } from 'react';
import { Card, Button } from '../components/ui';
import { Bell, Lock, Globe, Shield, Save } from 'lucide-react';

export const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    promos: true
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-[var(--text-secondary)]">Manage your preferences and account security.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Account Security */}
        <Card variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-[var(--accent-green)]" />
                <h2 className="text-xl font-bold">Security</h2>
            </div>
            
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--border-subtle)]">
                    <div>
                        <h3 className="font-semibold">Password</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">Change Password</Button>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="font-semibold">Two-Factor Authentication</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Add an extra layer of security to your account.</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out border-2 border-[var(--border-subtle)] rounded-full cursor-pointer bg-[var(--bg-tertiary)]">
                         <span className="translate-x-0 inline-block w-5 h-5 transform bg-[var(--text-muted)] rounded-full transition duration-200 ease-in-out" />
                    </div>
                </div>
            </div>
        </Card>

        {/* Notifications */}
        <Card variant="glass" className="p-6">
             <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-[var(--accent-green)]" />
                <h2 className="text-xl font-bold">Notifications</h2>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                    <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Receive booking confirmations via email</p>
                    </div>
                    <button 
                        onClick={() => toggleNotification('email')}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.email ? 'bg-[var(--accent-green)]' : 'bg-[var(--bg-primary)] border border-[var(--text-muted)]'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                    <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Receive booking reminders via SMS</p>
                    </div>
                    <button 
                        onClick={() => toggleNotification('sms')}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.sms ? 'bg-[var(--accent-green)]' : 'bg-[var(--bg-primary)] border border-[var(--text-muted)]'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.sms ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                    <div>
                        <h4 className="font-medium">Marketing & Promos</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Receive news about discounts and events</p>
                    </div>
                    <button 
                        onClick={() => toggleNotification('promos')}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.promos ? 'bg-[var(--accent-green)]' : 'bg-[var(--bg-primary)] border border-[var(--text-muted)]'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.promos ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>
        </Card>

        {/* Global Preferences */}
        <Card variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-[var(--accent-green)]" />
                <h2 className="text-xl font-bold">Preferences</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Language</label>
                    <select className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)]">
                        <option>English (US)</option>
                        <option>Filipino</option>
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Timezone</label>
                    <select className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)]">
                        <option>Asia/Manila (GMT+8)</option>
                        <option>UTC</option>
                    </select>
                </div>
            </div>
        </Card>

        {/* Data Management */}
        <Card variant="outlined" className="p-6 border-red-900/30 bg-red-900/5">
             <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold text-red-500">Data Zone</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
                <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">Download My Data</Button>
                <Button variant="ghost" className="text-red-500 hover:bg-red-500/10">Delete Account</Button>
            </div>
        </Card>

      </div>
      
       <div className="mt-8 flex justify-end">
            <Button variant="primary" size="lg" icon={<Save className="w-4 h-4" />}>
                Save Changes
            </Button>
      </div>

    </div>
  );
};
