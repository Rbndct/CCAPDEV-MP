import { useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, LogOut, Edit2, Check, X as XIcon, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Badge } from '../components/ui';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || 'Aaron Escandor',
    email: user?.email || 'aaron@example.com',
    phone: '+63 912 345 6789',
    bio: 'Sports enthusiast and weekend warrior. Love playing basketball and badminton.',
    notifications: true,
    twoFactor: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Quick Stats */}
        <div className="md:col-span-1 space-y-6">
          <Card variant="glass" className="p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center border-4 border-[var(--bg-primary)] shadow-xl overflow-hidden">
                <span className="text-4xl font-bold text-[var(--accent-green)]">
                  {userInfo.name.charAt(0)}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-[var(--accent-green)] rounded-full text-[var(--bg-primary)] hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold mb-1">{userInfo.name}</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">Member since Feb 2026</p>
            
            <Badge variant="success" className="px-3 py-1">Active Member</Badge>

            <div className="mt-8 grid grid-cols-2 gap-4 text-center border-t border-[var(--border-subtle)] pt-6">
              <div>
                <div className="text-2xl font-bold text-[var(--accent-green)]">12</div>
                <div className="text-xs text-[var(--text-muted)]">Bookings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--accent-green)]">48</div>
                <div className="text-xs text-[var(--text-muted)]">Hours Played</div>
              </div>
            </div>
          </Card>

          <Card variant="glass" className="p-0 overflow-hidden">
             <div className="p-4 border-b border-[var(--border-subtle)]">
               <h3 className="font-bold flex items-center gap-2">
                 <Shield className="w-4 h-4 text-[var(--accent-green)]" />
                 Account Security
               </h3>
             </div>
             <div className="p-4 space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-sm text-[var(--text-secondary)]">2-Factor Auth</span>
                 <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${userInfo.twoFactor ? 'bg-[var(--accent-green)]' : 'bg-[var(--bg-tertiary)]'}`} onClick={() => setUserInfo({...userInfo, twoFactor: !userInfo.twoFactor})}>
                   <div className={`w-4 h-4 bg-white rounded-full transition-transform ${userInfo.twoFactor ? 'translate-x-4' : 'translate-x-0'}`} />
                 </div>
               </div>
               <Button variant="outline" className="w-full text-xs">Change Password</Button>
             </div>
          </Card>
        </div>

        {/* Right Column - Details & Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Personal Information</h3>
              <Button 
                variant={isEditing ? 'ghost' : 'outline'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="gap-2"
              >
                {isEditing ? <XIcon className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input 
                      type="text" 
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--accent-green)] focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input 
                      type="email" 
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--accent-green)] focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input 
                      type="tel" 
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--accent-green)] focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input 
                      type="date" 
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--accent-green)] focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Bio</label>
                <textarea 
                  value={userInfo.bio}
                  onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--accent-green)] focus:outline-none disabled:opacity-50"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <Button variant="primary" type="submit" icon={<Check className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </Card>

          <Card variant="outlined" className="p-6 border-red-500/20">
            <h3 className="text-lg font-bold text-red-500 mb-4">Danger Zone</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Sign Out</h4>
                <p className="text-sm text-[var(--text-muted)]">Sign out of your account on this device</p>
              </div>
              <Button variant="outline" className="text-red-500 border-red-500/50 hover:bg-red-500/10" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
