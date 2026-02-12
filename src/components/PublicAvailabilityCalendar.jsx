import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { Card, Button, Badge } from './ui';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

// Generate time slots for a day (30-minute intervals)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 22) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

// Mock availability data
const getMockAvailability = (date, time) => {
  const hash = (date + time).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  const random = Math.abs(hash % 100);

  if (random < 30) return 'booked';
  if (random < 35) return 'blocked';
  return 'available';
};

// Get the index of a time slot in the full list
const getSlotIndex = (time, allSlots) => allSlots.indexOf(time);

export const PublicAvailabilityCalendar = ({ facility, onSlotSelect }) => {
  const { isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeFilter, setTimeFilter] = useState('all');

  // Multi-slot selection state
  const [selectionStart, setSelectionStart] = useState(null); // { dateStr, dayIdx, time }
  const [selectionEnd, setSelectionEnd] = useState(null);     // { dateStr, dayIdx, time }

  const timeSlots = generateTimeSlots();

  const getWeekDates = (date) => {
    const week = [];
    const current = new Date(date);
    current.setDate(current.getDate() - current.getDay());
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
    clearSelection();
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
    clearSelection();
  };

  const clearSelection = () => {
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const handleSlotClick = (date, time, dayIdx) => {
    const dateStr = date.toISOString().split('T')[0];
    const status = getMockAvailability(dateStr, time);
    if (status !== 'available') return;

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!selectionStart) {
      // First click — set start
      setSelectionStart({ dateStr, dayIdx, time });
      setSelectionEnd(null);
    } else if (selectionStart && !selectionEnd) {
      // Second click
      if (dayIdx !== selectionStart.dayIdx) {
        // Different day — restart selection on new day
        setSelectionStart({ dateStr, dayIdx, time });
        setSelectionEnd(null);
        return;
      }

      const startIdx = getSlotIndex(selectionStart.time, timeSlots);
      const endIdx = getSlotIndex(time, timeSlots);

      if (endIdx <= startIdx) {
        // Clicked before or same as start — restart
        setSelectionStart({ dateStr, dayIdx, time });
        setSelectionEnd(null);
        return;
      }

      // Check all slots in range are available
      const allAvailable = timeSlots.slice(startIdx, endIdx + 1).every(
        t => getMockAvailability(dateStr, t) === 'available'
      );

      if (!allAvailable) return;

      setSelectionEnd({ dateStr, dayIdx, time });
    } else {
      // Already have both — restart
      setSelectionStart({ dateStr, dayIdx, time });
      setSelectionEnd(null);
    }
  };

  const isSlotInSelection = (dateStr, dayIdx, time) => {
    if (!selectionStart) return false;
    if (dayIdx !== selectionStart.dayIdx) return false;

    const slotIdx = getSlotIndex(time, timeSlots);
    const startIdx = getSlotIndex(selectionStart.time, timeSlots);

    if (selectionEnd) {
      const endIdx = getSlotIndex(selectionEnd.time, timeSlots);
      return slotIdx >= startIdx && slotIdx <= endIdx;
    }

    // Only start selected
    return slotIdx === startIdx;
  };

  const isSlotStart = (dayIdx, time) => {
    return selectionStart && dayIdx === selectionStart.dayIdx && time === selectionStart.time;
  };

  const isSlotEnd = (dayIdx, time) => {
    return selectionEnd && dayIdx === selectionEnd.dayIdx && time === selectionEnd.time;
  };

  const getSelectionDuration = () => {
    if (!selectionStart || !selectionEnd) return 0;
    const startIdx = getSlotIndex(selectionStart.time, timeSlots);
    const endIdx = getSlotIndex(selectionEnd.time, timeSlots);
    return (endIdx - startIdx + 1) * 0.5; // each slot is 30 min
  };

  const getEndTimeLabel = () => {
    if (!selectionEnd) return '';
    const endIdx = getSlotIndex(selectionEnd.time, timeSlots);
    // The end time of the booking is 30 min after the last selected slot
    if (endIdx + 1 < timeSlots.length) return timeSlots[endIdx + 1];
    return '22:30';
  };

  const handleConfirmBooking = () => {
    if (!selectionStart || !selectionEnd || !onSlotSelect) return;
    const duration = getSelectionDuration();
    onSlotSelect({
      date: selectionStart.dateStr,
      startTime: selectionStart.time,
      endTime: getEndTimeLabel(),
      duration,
      facility,
    });
  };

  const filterTimeSlots = (slots) => {
    if (timeFilter === 'morning') return slots.filter(t => parseInt(t) < 12);
    if (timeFilter === 'afternoon') return slots.filter(t => parseInt(t) >= 12 && parseInt(t) < 18);
    if (timeFilter === 'evening') return slots.filter(t => parseInt(t) >= 18);
    return slots;
  };

  const filteredSlots = filterTimeSlots(timeSlots);

  const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formatDay = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });

  const duration = getSelectionDuration();
  const totalPrice = duration * facility.price;

  return (
    <Card variant="outlined" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-[var(--accent-green)]" />
          <h3 className="text-xl font-bold">Availability Schedule</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handlePrevWeek}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm font-medium px-3">
            {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
          </span>
          <Button variant="ghost" size="sm" onClick={handleNextWeek}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2 mb-4">
        <Button variant={timeFilter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setTimeFilter('all')}>
          All Day
        </Button>
        <Button variant={timeFilter === 'morning' ? 'primary' : 'outline'} size="sm" onClick={() => setTimeFilter('morning')}>
          Morning (6AM-12PM)
        </Button>
        <Button variant={timeFilter === 'afternoon' ? 'primary' : 'outline'} size="sm" onClick={() => setTimeFilter('afternoon')}>
          Afternoon (12PM-6PM)
        </Button>
        <Button variant={timeFilter === 'evening' ? 'primary' : 'outline'} size="sm" onClick={() => setTimeFilter('evening')}>
          Evening (6PM-11PM)
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[rgba(0,255,136,0.2)] border border-[var(--accent-green)]"></div>
          <span className="text-[var(--text-muted)]">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[rgba(239,68,68,0.2)] border border-red-500"></div>
          <span className="text-[var(--text-muted)]">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]"></div>
          <span className="text-[var(--text-muted)]">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[rgba(0,255,136,0.4)] border-2 border-[var(--accent-green)]"></div>
          <span className="text-[var(--text-muted)]">Selected</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-sm font-medium text-[var(--text-muted)] text-center">Time</div>
            {weekDates.map((date, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xs text-[var(--text-muted)]">{formatDay(date)}</div>
                <div className="text-sm font-semibold">{formatDate(date)}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-1">
            {filteredSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 gap-2">
                <div className="flex items-center justify-center text-sm text-[var(--text-muted)]">
                  <Clock className="w-3 h-3 mr-1" />
                  {time}
                </div>
                {weekDates.map((date, dayIdx) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const status = getMockAvailability(dateStr, time);
                  const isPast = date < new Date() || (date.toDateString() === new Date().toDateString() && parseInt(time) < new Date().getHours());
                  const inSelection = isSlotInSelection(dateStr, dayIdx, time);
                  const isStart = isSlotStart(dayIdx, time);
                  const isEnd = isSlotEnd(dayIdx, time);

                  return (
                    <button
                      key={dayIdx}
                      onClick={() => handleSlotClick(date, time, dayIdx)}
                      disabled={status !== 'available' || isPast}
                      className={`
                        h-10 rounded-lg border transition-all text-xs font-medium
                        ${inSelection
                          ? 'bg-[rgba(0,255,136,0.35)] border-[var(--accent-green)] border-2 ring-1 ring-[var(--accent-green)] cursor-pointer'
                          : status === 'available' && !isPast
                            ? 'bg-[rgba(0,255,136,0.1)] border-[var(--accent-green)] hover:bg-[rgba(0,255,136,0.2)] cursor-pointer'
                            : status === 'booked'
                              ? 'bg-[rgba(239,68,68,0.1)] border-red-500 cursor-not-allowed'
                              : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] cursor-not-allowed'
                        }
                        ${isPast ? 'opacity-50' : ''}
                      `}
                    >
                      {inSelection && isStart && 'START'}
                      {inSelection && isEnd && 'END'}
                      {inSelection && !isStart && !isEnd && '•'}
                      {!inSelection && status === 'available' && !isPast && '✓'}
                      {status === 'booked' && '✕'}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selection Summary & Confirm */}
      {selectionStart && (
        <div className="mt-4 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--accent-green)] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-[var(--text-muted)]">Date: </span>
              <span className="font-semibold">
                {new Date(selectionStart.dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Time: </span>
              <span className="font-semibold">
                {selectionStart.time} - {selectionEnd ? getEndTimeLabel() : '...'}
              </span>
            </div>
            {selectionEnd && (
              <>
                <div>
                  <span className="text-[var(--text-muted)]">Duration: </span>
                  <span className="font-semibold">{duration}h</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Total: </span>
                  <span className="font-bold text-[var(--accent-green)]">₱{totalPrice.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors"
              title="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
            {selectionEnd && (
              <Button variant="primary" size="sm" onClick={handleConfirmBooking}>
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Info Note */}
      {!selectionStart && (
        <div className="mt-4 p-3 bg-[var(--bg-secondary)] rounded-lg">
          <p className="text-sm text-[var(--text-muted)]">
            {isLoggedIn
              ? '💡 Click a start time, then click an end time on the same day to select your duration'
              : '💡 Login to book a time slot'
            }
          </p>
        </div>
      )}

      {selectionStart && !selectionEnd && (
        <div className="mt-2 p-3 bg-[var(--bg-secondary)] rounded-lg">
          <p className="text-sm text-[var(--text-muted)]">
            💡 Now click an end time on the same day to complete your selection
          </p>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        returnTo={window.location.pathname}
      />
    </Card>
  );
};
