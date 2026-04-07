import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { EditReservationModal } from '../components/modals/EditReservationModal';
import { Calendar, Clock, TrendingUp, Filter, ArrowRight, XCircle, CheckCircle, AlertTriangle, TriangleAlert } from 'lucide-react';

import { useAuth, API_BASE_URL } from '../contexts/AuthContext';

const statusConfig = {
  confirmed: { variant: 'success', label: 'Confirmed' },
  pending: { variant: 'warning', label: 'Pending' },
  cancelled: { variant: 'error', label: 'Cancelled' },
  completed: { variant: 'info', label: 'Completed' },
  edited: { variant: 'warning', label: 'Edited' }
};

export const BookingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState('upcoming');

  // Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState(null);

  // Warning modal for 24h cutoff
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [pendingAction, setPendingAction] = useState(null); // 'cancel' | 'edit'

  const { token } = useAuth();
  const [allBookings, setAllBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [restrictionMessage, setRestrictionMessage] = useState('');

  const getBookingStartDateTime = (booking) => {
    // booking.time is like "HH:mm - HH:mm"
    const timeStr = booking?.time || '';
    const [startStr] = timeStr.split(' - ');
    if (!startStr) return null;
    const [hRaw, mRaw] = startStr.split(':');
    const h = Number(hRaw);
    const m = Number(mRaw || 0);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    const d = new Date(booking.date);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const isLockedWithin24Hours = (booking) => {
    const startDateTime = getBookingStartDateTime(booking);
    if (!startDateTime) return false;
    const diffMs = startDateTime.getTime() - Date.now();
    return diffMs <= 24 * 60 * 60 * 1000;
  };



  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/reservations/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        // Map the backend data to match the expected format in the table
        const bookingsArray = Array.isArray(data) ? data : data.data || [];
        const formatted = bookingsArray.map(r => {
          let duration = 1;
          let hourlyRate = 0;
          if (r.start_time && r.end_time) {
            const [startH, startM = 0] = r.start_time.split(':').map(Number);
            const [endH, endM = 0] = r.end_time.split(':').map(Number);
            if (!isNaN(startH) && !isNaN(endH)) duration = (endH + endM / 60) - (startH + startM / 60);
          }
          if (r.facility && r.facility.hourly_rate_php) {
            hourlyRate = r.facility.hourly_rate_php;
          }

          return {
            id: r._id,
            court: r.facility?.facility_name || r.facility?.name || 'Unknown Facility',
            facilityId: r.facility?._id,
            date: r.date,
            time: `${r.start_time} - ${r.end_time}`,
            status: r.status === 'reserved' ? 'confirmed' : r.status, // Map 'reserved' to 'confirmed' for student view
            price: r.total_price || (duration * hourlyRate),
            edit_history: r.edit_history || []
          };
        });
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
    setRestrictionMessage('');
    if (isLockedWithin24Hours(booking)) {
      const msg = `You can't cancel this booking within 24 hours of the scheduled start time.`;
      setWarningMessage(msg);
      setPendingAction({ type: 'cancel', booking });
      setIsWarningModalOpen(true);
      return;
    }
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  const handleEditClick = (booking) => {
    setRestrictionMessage('');
    setBookingToEdit({ ...booking, isWithin24Hours: isLockedWithin24Hours(booking) });
    setIsEditModalOpen(true);
  };



  const handleSaveEdit = async (updatedBooking) => {
    const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/reservations/${updatedBooking.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: updatedBooking.date,
        start_time: updatedBooking.start_time,
        end_time: updatedBooking.end_time
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update reservation.');
    }

    await fetchBookings();
    setBookingToEdit(null);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    setRestrictionMessage('');

    try {
      const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/reservations/${bookingToCancel.id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Re-fetch so the booking appears under the cancelled tab
        fetchBookings();
        return;
      }

      const data = await response.json().catch(() => ({}));
      if (data?.message) setRestrictionMessage(data.message);
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
      case 'history': {
        let historyEvents = [];
        allBookings.forEach(b => {
          if (b.status === 'completed') {
            historyEvents.push({ ...b, sortDate: new Date(b.date).getTime() });
          }
          if (b.edit_history && b.edit_history.length > 0) {
            b.edit_history.forEach((edit, index) => {
              historyEvents.push({
                id: `${b.id}-edit-${index}`,
                court: b.court,
                facilityId: b.facilityId,
                date: edit.modified_at,
                time: `Used to be ${edit.previous_start_time} - ${edit.previous_end_time}`,
                status: 'edited',
                price: b.price,
                sortDate: new Date(edit.modified_at).getTime()
              });
            });
          }
        });
        historyEvents.sort((a, b) => b.sortDate - a.sortDate);
        return historyEvents;
      }
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
        {restrictionMessage && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-sm">
            {restrictionMessage}
          </div>
        )}
      </div>

      {/* 24h Warning Modal */}
      <Modal
        isOpen={isWarningModalOpen}
        onClose={() => { setIsWarningModalOpen(false); setPendingAction(null); }}
        title="Last-Minute Change Warning"
        size="small"
        footer={
          <>
            <Button variant="primary" onClick={() => { setIsWarningModalOpen(false); setPendingAction(null); }}>
              Okay
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-bold mb-3">Important Notice</h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{warningMessage}</p>
        </div>
      </Modal>

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
                          {booking.status === 'pending' && (
                            <Link
                              to={`/dashboard/payment?reservationId=${booking.id}`}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--accent-green)] text-black hover:bg-[rgba(0,255,136,0.8)] transition-all flex items-center h-8"
                              title="Pay for reservation"
                            >
                              Pay Now
                            </Link>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="!px-2 !py-1 !text-xs h-8"
                            onClick={() => handleEditClick(booking)}
                          >
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

        </div>
      </Modal>

      <EditReservationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setBookingToEdit(null);
        }}
        booking={bookingToEdit}
        onSave={handleSaveEdit}
        mode="student"
      />
    </div>
  );
};
