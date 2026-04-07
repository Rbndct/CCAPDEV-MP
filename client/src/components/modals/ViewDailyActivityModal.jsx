import { Modal } from '../Modal';
import { Badge, Button } from '../ui';
import { Clock, User, Home, Calendar } from 'lucide-react';

export const ViewDailyActivityModal = ({ isOpen, onClose, date, bookings }) => {
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '';

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'reserved': return 'success';
            case 'no-show': return 'warning';
            default: return 'info';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Daily Activity" size="large">
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
                    <div className="p-2 rounded-lg bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{formattedDate}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{bookings.length} reservations scheduled</p>
                    </div>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {bookings.length > 0 ? (
                        bookings.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((booking) => (
                            <div key={booking.id} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-green)]/30 transition-all">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Home size={16} className="text-[var(--accent-green)]" />
                                                <span className="font-bold text-lg">{booking.facility}</span>
                                            </div>
                                            <Badge variant={getStatusVariant(booking.status)}>
                                                {booking.status.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                <User size={16} />
                                                <span className="font-medium text-[var(--text-primary)]">{booking.user}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                <Clock size={16} />
                                                <span className="font-medium text-[var(--text-primary)]">{booking.startTime} - {booking.endTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl border border-dashed border-[var(--border-subtle)]">
                            <Clock size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-20" />
                            <p className="text-[var(--text-secondary)]">No activities scheduled for this day.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--border-subtle)]">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
};
