import { useState } from 'react';
import { Modal } from '../Modal';
import { Badge, Button } from '../ui';
import { Mail, Phone, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const ViewNoShowsModal = ({ isOpen, onClose }) => {
    // Mock data for no-shows
    const [noShows, setNoShows] = useState([
        {
            id: 'R-1003',
            user: 'Mike Ross',
            email: 'mike@example.com',
            phone: '0917-xxx-xxxx',
            facility: 'Badminton Hall',
            date: '2026-02-10',
            time: '09:00 - 10:00',
            resolved: false
        },
        {
            id: 'R-1008',
            user: 'Harvey Specter',
            email: 'harvey@example.com',
            phone: '0922-xxx-xxxx',
            facility: 'Basketball Court A',
            date: '2026-02-11',
            time: '18:00 - 20:00',
            resolved: false
        },
        {
            id: 'R-1009',
            user: 'Louis Litt',
            email: 'louis@example.com',
            phone: '0933-xxx-xxxx',
            facility: 'Tennis Court 1',
            date: '2026-02-12',
            time: '10:00 - 11:00',
            resolved: true
        }
    ]);

    const handleResolve = (id) => {
        setNoShows(noShows.map(item =>
            item.id === id ? { ...item, resolved: !item.resolved } : item
        ));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="No-Show Alerts" size="large">
            <div className="space-y-4">
                <p className="text-sm text-[var(--text-secondary)]">
                    Listing all missed reservations. You can mark them as resolved after contacting the user.
                </p>

                <div className="space-y-3">
                    {noShows.map((item) => (
                        <div
                            key={item.id}
                            className={`p-4 rounded-xl border transition-colors ${item.resolved
                                    ? 'bg-[var(--bg-secondary)]/50 border-[var(--border-subtle)] opacity-75'
                                    : 'bg-red-500/5 border-red-500/20'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-lg">{item.user}</h4>
                                        <Badge variant={item.resolved ? 'success' : 'error'}>
                                            {item.resolved ? 'Resolved' : 'Missed'}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-[var(--text-secondary)]">
                                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {item.date}</span>
                                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {item.time}</span>
                                        <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {item.email}</span>
                                        <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {item.phone}</span>
                                    </div>
                                    <p className="text-sm pt-1">
                                        Facility: <span className="font-medium text-[var(--text-primary)]">{item.facility}</span>
                                    </p>
                                </div>

                                <div className="flex flex-row md:flex-col justify-end gap-2">
                                    <Button
                                        variant={item.resolved ? 'outline' : 'primary'}
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleResolve(item.id)}
                                    >
                                        <CheckCircle2 size={16} />
                                        {item.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                        <Mail size={16} /> Contact
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {noShows.length === 0 && (
                    <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl">
                        <p className="text-[var(--text-secondary)]">No no-show alerts found.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
