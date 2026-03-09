import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { Calendar, Clock, TrendingUp, Filter, ArrowRight, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';

import { useAuth, API_BASE_URL } from '../contexts/AuthContext';

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

  const { token } = useAuth();
  const [allBookings, setAllBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL || 'http://localhost:5000/api'}/reservations/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        // Map the backend data to match the expected format in the table
        // The backend returns an array directly
        const formatted = data.map(r => ({
          id: r._id,
          court: r.facility?.name || 'Unknown Facility',
          date: r.date,
          time: `${r.start_time} - ${r.end_time}`,
          status: r.status === 'reserved' ? 'confirmed' : r.status, // Map 'reserved' to 'confirmed' for student view
          price: r.total_price || 500
        }));
        setAllBookings(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch true bookings on mount
  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

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

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);

    try {
      const response = await fetch(`${API_BASE_URL || 'http://localhost:5000/api'}/reservations/${bookingToCancel.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh bookings after cancellation
        fetchBookings();
      } else {
        console.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsCancelling(false);
      setIsCancelModalOpen(false);
      setBookingToCancel(null);
    }
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
            className={`pb-4 px-2 font-medium text-sm transition-all relative ${currentTab === 'upcoming'
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
            className={`pb-4 px-2 font-medium text-sm transition-all relative ${currentTab === 'history'
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
            className={`pb-4 px-2 font-medium text-sm transition-all relative ${currentTab === 'cancelled'
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
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
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
