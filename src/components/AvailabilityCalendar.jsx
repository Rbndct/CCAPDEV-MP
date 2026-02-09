import { useState } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Card, Button, Badge } from './ui';

// Availability Calendar Component
export const AvailabilityCalendar = ({ facility, onClose }) => {
  // Generate time slots from 6 AM to 11 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6;
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  });
  
  // Days of the week
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Mock availability data (random for demo)
  const getSlotStatus = (dayIndex, timeIndex) => {
    const random = (dayIndex + timeIndex) % 3;
    if (random === 0) return 'available';
    if (random === 1) return 'booked';
    return 'maintenance';
  };
  
  const statusColors = {
    available: 'bg-[var(--success)] bg-opacity-20 border-[var(--success)] hover:bg-opacity-30',
    booked: 'bg-[var(--error)] bg-opacity-10 border-[var(--border-subtle)] cursor-not-allowed',
    maintenance: 'bg-[var(--warning)] bg-opacity-10 border-[var(--warning)] cursor-not-allowed'
  };
  
  const statusLabels = {
    available: 'Available',
    booked: 'Booked',
    maintenance: 'Maintenance'
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card variant="elevated" className="max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{facility.name}</h2>
            <p className="text-[var(--text-secondary)]">Weekly Availability Schedule</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Legend */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[var(--success)] bg-opacity-20 border-2 border-[var(--success)] rounded"></div>
            <span className="text-sm text-[var(--text-secondary)]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[var(--error)] bg-opacity-10 border-2 border-[var(--border-subtle)] rounded"></div>
            <span className="text-sm text-[var(--text-secondary)]">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[var(--warning)] bg-opacity-10 border-2 border-[var(--warning)] rounded"></div>
            <span className="text-sm text-[var(--text-secondary)]">Maintenance</span>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-8 gap-2 min-w-[800px]">
            {/* Header Row */}
            <div className="font-bold text-sm text-[var(--text-secondary)] p-2">Time</div>
            {days.map((day) => (
              <div key={day} className="font-bold text-sm text-center p-2">
                {day}
              </div>
            ))}
            
            {/* Time Slots */}
            {timeSlots.map((time, timeIndex) => (
              <>
                <div key={`time-${timeIndex}`} className="text-sm text-[var(--text-muted)] p-2 flex items-center">
                  {time}
                </div>
                {days.map((day, dayIndex) => {
                  const status = getSlotStatus(dayIndex, timeIndex);
                  return (
                    <div
                      key={`${day}-${timeIndex}`}
                      className={`border-2 rounded-lg p-2 text-xs text-center transition-all ${statusColors[status]}`}
                      title={`${day} ${time} - ${statusLabels[status]}`}
                    >
                      {status === 'available' && '✓'}
                      {status === 'booked' && '✕'}
                      {status === 'maintenance' && '⚠'}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-[var(--border-subtle)] flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary">
            Book Now
          </Button>
        </div>
      </Card>
    </div>
  );
};
