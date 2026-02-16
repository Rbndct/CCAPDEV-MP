import { useState } from 'react';
import { Navbar, Footer } from '../components/LandingPage';
import { Card, Badge } from '../components/ui';
import { Calendar, Clock, TrendingUp, Bell, Pencil, X, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EditReservationModal } from '../components/modals/EditReservationModal';

// Mock booking data
const mockUpcomingBookings = [
  {
    id: 1,
    court: 'Court A - Premium Basketball',
    date: '2026-02-12',
    time: '14:00 - 16:00',
    status: 'confirmed',
    price: 600
  },
  {
    id: 2,
    court: 'Court C - Tennis Court 1',
    date: '2026-02-15',
    time: '10:00 - 11:00',
    status: 'confirmed',
    price: 500
  },
  {
    id: 3,
    court: 'Court E - Badminton Hall',
    date: '2026-02-18',
    time: '18:00 - 19:00',
    status: 'pending',
    price: 500
  }
];

const mockBookingHistory = [
  {
    id: 4,
    court: 'Court B - Standard Basketball',
    date: '2026-02-05',
    time: '16:00 - 18:00',
    status: 'completed'
  },
  {
    id: 5,
    court: 'Court D - Tennis Court 2',
    date: '2026-01-28',
    time: '09:00 - 10:00',
    status: 'completed'
  },
  {
    id: 6,
    court: 'Court F - Volleyball Arena',
    date: '2026-01-20',
    time: '19:00 - 21:00',
    status: 'completed'
  }
];

const mockAnnouncements = [
  {
    id: 1,
    title: 'New Basketball Court Opening',
    description: 'State-of-the-art court with professional-grade flooring now available!',
    date: '2026-02-08',
    isNew: true
  },
  {
    id: 2,
    title: 'Weekend Special - 20% Off',
    description: 'Book any court for weekend sessions and get 20% off.',
    date: '2026-02-06',
    isNew: true
  },
  {
    id: 3,
    title: 'Maintenance Schedule',
    description: 'Court G will be under maintenance on Feb 14-15.',
    date: '2026-02-01',
    isNew: false
  }
];

const mockPlayers = [
  { id: 1, name: 'Pogi 1', sport: 'Basketball', avatar: 'J' },
  { id: 2, name: 'Pogi 2', sport: 'Tennis', avatar: 'M' },
  { id: 3, name: 'Ganda 3', sport: 'Badminton', avatar: 'C' },

];

const statusConfig = {
  confirmed: { variant: 'success', label: 'Confirmed' },
  pending: { variant: 'warning', label: 'Pending' },
  cancelled: { variant: 'error', label: 'Cancelled' },
  completed: { variant: 'info', label: 'Completed' }
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState(mockUpcomingBookings);
  const [editingBooking, setEditingBooking] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [playerSearch, setPlayerSearch] = useState('');

  const filteredPlayers = playerSearch.trim()
    ? mockPlayers.filter(p => p.name.toLowerCase().includes(playerSearch.toLowerCase()) || p.sport.toLowerCase().includes(playerSearch.toLowerCase()))
    : [];

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedBooking) => {
    setUpcomingBookings(prev =>
      prev.map(b => b.id === updatedBooking.id ? updatedBooking : b)
    );
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      setUpcomingBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[var(--bg-primary)] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, <span className="text-gradient-green">{user?.name}</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)]">
              Manage your bookings and explore new facilities
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upcoming Reservations */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Reservations */}
              <Card variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-[var(--accent-green)]" />
                    <h2 className="text-2xl font-bold">Upcoming Reservations</h2>
                  </div>
                  <Link to="/dashboard/bookings?tab=upcoming" className="text-[var(--accent-green)] hover:underline text-sm font-medium">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id} variant="glass" className="p-4 hover:border-[var(--accent-green)] transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{booking.court}</h3>
                            <Badge variant={statusConfig[booking.status].variant}>
                              {statusConfig[booking.status].label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="text-2xl font-bold text-[var(--accent-green)]">₱{booking.price}</p>
                          <p className="text-xs text-[var(--text-muted)]">per hour</p>
                          {(booking.status === 'confirmed' || booking.status === 'pending') && (
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => handleEditClick(booking)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] transition-all"
                                title="Edit reservation"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-red-500 hover:text-red-500 transition-all"
                                title="Cancel reservation"
                              >
                                <X className="w-3.5 h-3.5" />
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Booking History Preview */}
              <Card variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-[var(--accent-green)]" />
                    <h2 className="text-2xl font-bold">Recent History</h2>
                  </div>
                  <Link to="/dashboard/bookings?tab=history" className="text-[var(--accent-green)] hover:underline text-sm font-medium">
                    View Full History
                  </Link>
                </div>

                <div className="space-y-3">
                  {mockBookingHistory.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <div>
                        <p className="font-medium">{booking.court}</p>
                        <p className="text-sm text-[var(--text-muted)]">
                          {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {booking.time}
                        </p>
                      </div>
                      <Badge variant={statusConfig[booking.status].variant}>
                        {statusConfig[booking.status].label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Search & Announcements */}
            <div className="space-y-8">
              {/* Search Players */}
              <Card variant="elevated" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-[var(--accent-green)]" />
                  <h2 className="text-2xl font-bold">Find Users</h2>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search by name or sport..."
                    value={playerSearch}
                    onChange={(e) => setPlayerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-sm focus:border-[var(--accent-green)] focus:outline-none focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] transition-all placeholder:text-[var(--text-muted)]"
                  />
                </div>

                {playerSearch.trim() && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredPlayers.length > 0 ? (
                      filteredPlayers.map((player) => (
                        <Link key={player.id} to={`/dashboard/user/${player.id}`}>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-green)] transition-all cursor-pointer">
                            <div className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-[var(--accent-green)]">{player.avatar}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{player.name}</p>
                              <p className="text-xs text-[var(--text-muted)]">{player.sport}</p>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--text-muted)] text-center py-4">No players found</p>
                    )}
                  </div>
                )}

                {!playerSearch.trim() && (
                  <p className="text-xs text-[var(--text-muted)] text-center">
                    Search for players by name or sport
                  </p>
                )}
              </Card>

              {/* Facility Announcements */}
              <Card variant="elevated" className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-6 h-6 text-[var(--accent-green)]" />
                  <h2 className="text-2xl font-bold">Announcements</h2>
                </div>

                <div className="space-y-4">
                  {mockAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold">{announcement.title}</h3>
                        {announcement.isNew && <Badge variant="neon">New</Badge>}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">
                        {announcement.description}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <EditReservationModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingBooking(null); }}
        booking={editingBooking}
        onSave={handleSaveEdit}
      />
    </>
  );
};
