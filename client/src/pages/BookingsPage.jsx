import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { Calendar, Clock, TrendingUp, Filter, ArrowRight, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';

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
    status: 'completed',
    price: 500
  },
  {
    id: 5,
    court: 'Court D - Tennis Court 2',
    date: '2026-01-28',
    time: '09:00 - 10:00',
    status: 'completed',
    price: 500
  },
  {
    id: 6,
    court: 'Court F - Volleyball Arena',
    date: '2026-01-20',
    time: '19:00 - 21:00',
    status: 'completed',
    price: 500
  },
  {
    id: 7,
    court: 'Court G - Multi-Purpose',
    date: '2026-01-15',
    time: '14:00 - 16:00',
    status: 'cancelled',
    price: 500
  }
];

// Combined bookings for easier filtering
const allBookings = [...mockUpcomingBookings, ...mockBookingHistory];

const statusConfig = {
  confirmed: { variant: 'success', label: 'Confirmed' },
  pending: { variant: 'warning', label: 'Pending' },
  cancelled: { variant: 'error', label: 'Cancelled' },
  completed: { variant: 'info', label: 'Completed' }
};

export const BookingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState('upcoming');
  
  // Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // Sync state with URL query params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setCurrentTab(tab);
    } else {
      setCurrentTab('upcoming');
    }
  }, [searchParams, location.search]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
    setCurrentTab(tab);
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = () => {
    // In a real app, you would make an API call here
    console.log('Cancelling booking:', bookingToCancel?.id);
    // Remove from UI or update status (mock implementation)
    // alert(`Booking for ${bookingToCancel?.court} cancelled!`); 
    setIsCancelModalOpen(false);
    setBookingToCancel(null);
  };

  // Filter bookings based on current tab
  const getFilteredBookings = () => {
    switch (currentTab) {
      case 'upcoming':
        return allBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
      case 'history':
        return allBookings.filter(b => b.status === 'completed');
      case 'cancelled':
        return allBookings.filter(b => b.status === 'cancelled');
      default:
        return [];
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-[var(--text-secondary)]">
          Manage your bookings and view your history
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border-subtle)] mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => handleTabChange('upcoming')}
            className={`pb-4 px-2 font-medium text-sm transition-all relative ${
              currentTab === 'upcoming'
                ? 'text-[var(--accent-green)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Upcoming
            {currentTab === 'upcoming' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent-green)] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('history')}
            className={`pb-4 px-2 font-medium text-sm transition-all relative ${
              currentTab === 'history'
                ? 'text-[var(--accent-green)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            History
            {currentTab === 'history' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent-green)] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('cancelled')}
            className={`pb-4 px-2 font-medium text-sm transition-all relative ${
              currentTab === 'cancelled'
                ? 'text-[var(--accent-green)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Cancelled
            {currentTab === 'cancelled' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent-green)] rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Booking Table */}
      <Card variant="elevated" className="overflow-hidden">
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
                  <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Court</th>
                  <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Date</th>
                  <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Time</th>
                  <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Price</th>
                  <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Status</th>
                  {currentTab === 'upcoming' && (
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <td className="p-4 font-medium">{booking.court}</td>
                    <td className="p-4 text-sm text-[var(--text-secondary)]">
                      {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)]">{booking.time}</td>
                    <td className="p-4 text-sm font-bold text-[var(--accent-green)]">₱{booking.price}</td>
                    <td className="p-4">
                      <Badge variant={statusConfig[booking.status].variant}>
                        {statusConfig[booking.status].label}
                      </Badge>
                    </td>
                    {currentTab === 'upcoming' && (
                      <td className="p-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="!px-2 !py-1 !text-xs h-8">
                              Modify
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="!px-2 !py-1 !text-xs h-8 text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500"
                              onClick={() => handleCancelClick(booking)}
                            >
                              Cancel
                            </Button>
                         </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)] mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium text-[var(--text-primary)]">No bookings found</p>
            <p className="text-[var(--text-secondary)] mb-4">
              {currentTab === 'upcoming' 
                ? "You don't have any upcoming reservations." 
                : `No ${currentTab} bookings to display.`}
            </p>
            {currentTab === 'upcoming' && (
              <Link to="/dashboard/book">
                <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                  Book a Court Now
                </Button>
              </Link>
            )}
          </div>
        )}
      </Card>

      {/* Cancellation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Reservation"
        size="small"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCancelModalOpen(false)}>
              Keep Reservation
            </Button>
            <Button 
              variant="primary" 
              className="bg-red-500 hover:bg-red-600 hover:shadow-red-500/20 text-white"
              onClick={confirmCancel}
            >
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">Are you sure?</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            You are about to cancel your reservation for <span className="font-bold text-[var(--text-primary)]">{bookingToCancel?.court}</span> on {bookingToCancel && new Date(bookingToCancel.date).toLocaleDateString()}.
          </p>
          <p className="text-sm text-[var(--text-muted)] bg-[var(--bg-tertiary)] p-3 rounded-lg w-full">
            Note: Cancellations made less than 24 hours before the reservation may be subject to a cancellation fee.
          </p>
        </div>
      </Modal>
    </div>
  );
};
