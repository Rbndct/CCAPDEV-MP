import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Trophy } from 'lucide-react';
import { Card, Badge } from '../components/ui';

// Mock user profiles (matches mockPlayers in DashboardPage)
const mockUserProfiles = {
  1: {
    id: 1,
    name: 'Pogi 1',
    email: 'pogi1@gmail.com',
    avatar: 'J',
    sport: 'Basketball',
    bio: 'Pogi lang',
    memberSince: 'Jan 2026',
    totalBookings: 24,
    hoursPlayed: 56,
  }
};

export const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const profile = mockUserProfiles[userId];

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
        <p className="text-[var(--text-secondary)] mb-6">This user profile doesn't exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-[var(--accent-green)] hover:underline"
        >
          Go Back
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
