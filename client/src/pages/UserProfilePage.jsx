import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Calendar, Trophy, Loader } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { API_BASE_URL } from '../contexts/AuthContext';

export const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/profiles/${userId}`);
        if (!res.ok) {
          throw new Error('User not found');
        }
        const data = await res.json();
        
        let totalHours = 0;
        let totalBookings = data.reservations ? data.reservations.length : 0;
        
        if (data.reservations) {
            data.reservations.forEach(r => {
                 if (r.start_time && r.end_time) {
                     const [startH, startM = 0] = String(r.start_time).split(':').map(Number);
                     const [endH, endM = 0] = String(r.end_time).split(':').map(Number);
                     if (!isNaN(startH) && !isNaN(endH) && endH > startH) {
                         totalHours += (endH + endM / 60) - (startH + startM / 60);
                     }
                 }
            });
        }
        
        setProfile({
          id: data.user._id,
          name: data.user.full_name,
          email: 'Hidden',
          avatar: data.user.full_name.charAt(0),
          sport: data.user.role === 'student' ? 'Member' : 'Admin',
          bio: data.user.bio || 'This user is mysterious.',
          memberSince: new Date(data.user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          totalBookings: totalBookings,
          hoursPlayed: totalHours
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  if (isLoading) {
      return (
          <div className="flex justify-center py-16">
              <Loader className="w-8 h-8 animate-spin text-[var(--accent-green)]" />
          </div>
      );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 animate-fade-in">
        <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
        <p className="text-[var(--text-secondary)] mb-6">This user profile doesn't exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-[var(--accent-green)] hover:underline flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4"/> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left - Avatar & Stats */}
        <div className="md:col-span-1 space-y-6">
          <Card variant="glass" className="p-6 text-center">
            <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center border-4 border-[var(--bg-primary)] shadow-xl">
              <span className="text-4xl font-bold text-[var(--accent-green)]">
                {profile.avatar}
              </span>
            </div>

            <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">Member since {profile.memberSince}</p>
            <Badge variant="success" className="px-3 py-1">{profile.sport} Player</Badge>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center border-t border-[var(--border-subtle)] pt-6">
              <div>
                <div className="text-2xl font-bold text-[var(--accent-green)]">{profile.totalBookings}</div>
                <div className="text-xs text-[var(--text-muted)]">Bookings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--accent-green)]">{profile.hoursPlayed}</div>
                <div className="text-xs text-[var(--text-muted)]">Hours Played</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right - Info */}
        <div className="md:col-span-2 space-y-6">
          <Card variant="elevated" className="p-6">
            <h3 className="text-xl font-bold mb-4">About</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">{profile.bio}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[var(--accent-green)]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Name</p>
                  <p className="font-medium">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-[var(--accent-green)]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Primary Sport</p>
                  <p className="font-medium">{profile.sport}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[var(--accent-green)]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Member Since</p>
                  <p className="font-medium">{profile.memberSince}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
