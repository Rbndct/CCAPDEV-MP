import { Navbar, Footer } from '../components/LandingPage';
import { Card, Button, Badge } from '../components/ui';
import { Calendar, Clock, Trophy, ArrowRight, TrendingUp, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock booking data
const mockUpcomingBookings = [
  {
    id: 1,
    court: 'Court A - Premium Basketball',
    date: '2026-02-12',
    time: '14:00 - 16:00',
    status: 'confirmed',
    price: 50
  },
  {
    id: 2,
    court: 'Court C - Tennis Court 1',
    date: '2026-02-15',
    time: '10:00 - 11:00',
    status: 'confirmed',
    price: 40
  },
  {
    id: 3,
    court: 'Court E - Badminton Hall',
    date: '2026-02-18',
    time: '18:00 - 19:00',
    status: 'pending',
    price: 30
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

const statusConfig = {
  confirmed: { variant: 'success', label: 'Confirmed' },
  pending: { variant: 'warning', label: 'Pending' },
  cancelled: { variant: 'error', label: 'Cancelled' },
  completed: { variant: 'info', label: 'Completed' }
};

export const DashboardPage = () => {
  const { user } = useAuth();

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
                  <Link to="/bookings" className="text-[var(--accent-green)] hover:underline text-sm font-medium">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {mockUpcomingBookings.map((booking) => (
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
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[var(--accent-green)]">₱{booking.price}</p>
                          <p className="text-xs text-[var(--text-muted)]">per hour</p>
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
                  <Link to="/bookings/history" className="text-[var(--accent-green)] hover:underline text-sm font-medium">
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

            {/* Right Column - Quick Actions & Announcements */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card variant="elevated" className="p-6">
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <Link to="/facilities">
                    <Button variant="primary" className="w-full !rounded-[var(--radius-md)]" icon={<ArrowRight className="w-4 h-4" />}>
                      Book a Facility
                    </Button>
                  </Link>
                  <Link to="/bookings">
                    <Button variant="outline" className="w-full !rounded-[var(--radius-md)]">
                      View All Bookings
                    </Button>
                  </Link>
                  <Link to="/facilities">
                    <Button variant="ghost" className="w-full !rounded-[var(--radius-md)]">
                      Browse Facilities
                    </Button>
                  </Link>
                </div>
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
    </>
  );
};
