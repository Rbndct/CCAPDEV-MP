import { useEffect, useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Bell, Lock, Globe, Shield, Save } from 'lucide-react';
import { useAuth, API_BASE_URL } from '../contexts/AuthContext';

export const SettingsPage = () => {
  const { token, refreshUser } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    promos: true
  });

  const [language, setLanguage] = useState('English (US)');
  const [timezone, setTimezone] = useState('Asia/Manila (GMT+8)');
  const [saveStatus, setSaveStatus] = useState('');

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/profiles/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setLanguage(data.language || 'English (US)');
        setTimezone(data.timezone || 'Asia/Manila (GMT+8)');
      } catch (err) {
        console.error('Failed to load preferences', err);
      }
    };
    loadPreferences();
  }, [token]);

  const handleSavePreferences = async () => {
    setSaveStatus('');
    try {
      const res = await fetch(`${API_BASE_URL}/profiles/me/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ language, timezone })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to save preferences.');
      }

      setSaveStatus('Preferences saved successfully.');
      if (refreshUser) await refreshUser();
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus(err.message || 'Failed to save preferences.');
      setTimeout(() => setSaveStatus(''), 4000);
    }
  };

  const handleChangePassword = async () => {
    setPasswordStatus('');

    if (newPassword !== confirmPassword) {
      setPasswordStatus('New password and confirm password do not match.');
      return;
    }
    if (!currentPassword || !newPassword) {
      setPasswordStatus('Please fill in current and new password.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch(`${API_BASE_URL}/profiles/me/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Password change failed.');
      }

      setPasswordStatus('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordOpen(false);
      if (refreshUser) await refreshUser();
      setTimeout(() => setPasswordStatus(''), 3000);
    } catch (err) {
      setPasswordStatus(err.message || 'Password change failed.');
      setTimeout(() => setPasswordStatus(''), 4000);
    } finally {
      setIsChangingPassword(false);
    }
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
                    <Button variant="outline" size="sm" onClick={() => setIsPasswordOpen(v => !v)}>
                      {isPasswordOpen ? 'Close' : 'Change Password'}
                    </Button>
                </div>

                {isPasswordOpen && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordStatus && (
                      <div className={`text-sm ${passwordStatus.toLowerCase().includes('success') ? 'text-[var(--accent-green)]' : 'text-red-500'}`}>
                        {passwordStatus}
                      </div>
                    )}
                    <Button
                      variant="primary"
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="w-full"
                    >
                      {isChangingPassword ? 'Changing...' : 'Update Password'}
                    </Button>
                  </div>
                )}

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
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)]"
                    >
                      <option>English (US)</option>
                      <option>Filipino</option>
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)]"
                    >
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
      
       <div className="mt-8 flex justify-end items-center gap-4">
            {saveStatus && (
              <div className={`text-sm ${saveStatus.toLowerCase().includes('success') ? 'text-[var(--accent-green)]' : 'text-red-500'}`}>
                {saveStatus}
              </div>
            )}
            <Button
              variant="primary"
              size="lg"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
      </div>

    </div>
  );
};
