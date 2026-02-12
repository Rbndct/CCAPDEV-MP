import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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
  // Simulate some booked slots
  const hash = (date + time).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  const random = Math.abs(hash % 100);

  if (random < 30) return 'booked';
  if (random < 35) return 'blocked';
  return 'available';
};

export const PublicAvailabilityCalendar = ({ facility, onSlotSelect }) => {
  const { isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeFilter, setTimeFilter] = useState('all');

  const timeSlots = generateTimeSlots();

  // Get week dates
  const getWeekDates = (date) => {
    const week = [];
    const current = new Date(date);
    current.setDate(current.getDate() - current.getDay()); // Start from Sunday

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
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleSlotClick = (date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    const status = getMockAvailability(dateStr, time);

    if (status !== 'available') return;

    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      if (onSlotSelect) {
        onSlotSelect({ date: dateStr, time, facility });
      }
    }
  };

  const filterTimeSlots = (slots) => {
    if (timeFilter === 'morning') return slots.filter(t => parseInt(t) < 12);
    if (timeFilter === 'afternoon') return slots.filter(t => parseInt(t) >= 12 && parseInt(t) < 18);
    if (timeFilter === 'evening') return slots.filter(t => parseInt(t) >= 18);
    return slots;
  };

  const filteredSlots = filterTimeSlots(timeSlots);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

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
        <Button
          variant={timeFilter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setTimeFilter('all')}
        >
          All Day
        </Button>
        <Button
          variant={timeFilter === 'morning' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setTimeFilter('morning')}
        >
          Morning (6AM-12PM)
        </Button>
        <Button
          variant={timeFilter === 'afternoon' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setTimeFilter('afternoon')}
        >
          Afternoon (12PM-6PM)
        </Button>
        <Button
          variant={timeFilter === 'evening' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setTimeFilter('evening')}
        >
          Evening (6PM-11PM)
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm">
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
                {weekDates.map((date, idx) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const status = getMockAvailability(dateStr, time);
                  const isPast = date < new Date() || (date.toDateString() === new Date().toDateString() && parseInt(time) < new Date().getHours());

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSlotClick(date, time)}
                      disabled={status !== 'available' || isPast}
                      className={`
                        h-10 rounded-lg border transition-all text-xs font-medium
                        ${status === 'available' && !isPast
                          ? 'bg-[rgba(0,255,136,0.1)] border-[var(--accent-green)] hover:bg-[rgba(0,255,136,0.2)] cursor-pointer'
                          : status === 'booked'
                            ? 'bg-[rgba(239,68,68,0.1)] border-red-500 cursor-not-allowed'
                            : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] cursor-not-allowed'
                        }
                        ${isPast ? 'opacity-50' : ''}
                      `}
                    >
                      {status === 'available' && !isPast && '✓'}
                      {status === 'booked' && '✕'}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-[var(--bg-secondary)] rounded-lg">
        <p className="text-sm text-[var(--text-muted)]">
          {isLoggedIn
            ? '💡 Click on an available slot to book it'
            : '💡 Login to book a time slot'
          }
        </p>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        returnTo={window.location.pathname}
      />
    </Card>
  );
};
