import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Badge, Button } from '../ui';
import { Mail, Phone, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth, API_BASE_URL } from '../../contexts/AuthContext';

export const ViewNoShowsModal = ({ isOpen, onClose }) => {
    const { token } = useAuth();
    const [noShows, setNoShows] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchNoShows();
        }
    }, [isOpen]);

    const fetchNoShows = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/reservations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            const noShowData = data.filter(r => r.status === 'no-show');
            setNoShows(noShowData.map(res => ({
                id: res._id,
                user: res.walk_in_name || (res.user ? res.user.full_name : 'N/A'),
                email: res.user ? res.user.email : 'N/A',
                phone: res.user && res.user.phone ? res.user.phone : 'N/A',
                facility: res.facility ? res.facility.name : 'N/A',
                date: res.date ? new Date(res.date).toISOString().split('T')[0] : 'N/A',
                time: `${res.start_time} - ${res.end_time}`,
                resolved: false
            })));
        } catch (error) {
            console.error('Error fetching no-shows:', error);
        }
    };

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
