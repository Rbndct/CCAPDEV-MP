import { Dialog } from '@headlessui/react';
import { Button } from '../ui';
import { X } from 'lucide-react';

export function ViewBookingHistoryModal({ isOpen, onClose, user }) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div className="bg-[var(--bg-primary)] rounded-lg shadow-lg z-10 max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-[var(--bg-secondary)] rounded"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">{user.name}'s Booking History</h2>

        {user.bookingsHistory && user.bookingsHistory.length > 0 ? (
          <ul className="space-y-2">
            {user.bookingsHistory.map((booking, i) => (
              <li key={i} className="p-2 bg-[var(--bg-secondary)] rounded flex justify-between">
                <span>{booking.date} • {booking.time}</span>
                <span className="font-medium">{booking.court}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--text-muted)]">No bookings found.</p>
        )}

        <div className="mt-4 text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Dialog>
  );
}
