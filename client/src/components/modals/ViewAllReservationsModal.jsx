import { useState } from 'react';
import { Modal } from '../Modal';
import { Badge, Button } from '../ui';
import { Search, Calendar, Clock, Check, X } from 'lucide-react';

export const ViewAllReservationsModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Mock data - in real app, this would come from props or API
    const [reservations, setReservations] = useState([
        { id: 'R-1001', user: 'John Doe', facility: 'Basketball Court A', date: '2026-02-12', time: '14:00 - 16:00', status: 'confirmed', payment: 'paid' },
        { id: 'R-1002', user: 'Jane Smith', facility: 'Tennis Court 1', date: '2026-02-15', time: '10:00 - 11:00', status: 'pending', payment: 'unpaid' },
        { id: 'R-1003', user: 'Mike Ross', facility: 'Badminton Hall', date: '2026-02-10', time: '09:00 - 10:00', status: 'no-show', payment: 'paid' },
        { id: 'R-1004', user: 'Sarah Cole', facility: 'Volleyball Arena', date: '2026-02-14', time: '18:00 - 20:00', status: 'confirmed', payment: 'paid' },
        { id: 'R-1005', user: 'Tom Hardy', facility: 'Basketball Court B', date: '2026-02-11', time: '16:00 - 17:00', status: 'cancelled', payment: 'refunded' },
        { id: 'R-1006', user: 'Emma Watson', facility: 'Tennis Court 2', date: '2026-02-13', time: '15:00 - 16:00', status: 'pending', payment: 'unpaid' },
        { id: 'R-1007', user: 'Chris Evans', facility: 'Basketball Court A', date: '2026-02-16', time: '10:00 - 12:00', status: 'confirmed', payment: 'paid' },
    ]);

    const handleStatusChange = (id, newStatus) => {
        setReservations(reservations.map(res =>
            res.id === id ? { ...res, status: newStatus } : res
        ));
    };

    const filteredReservations = reservations.filter(res => {
        const matchesStatus = filterStatus === 'all' || res.status === filterStatus;
        const matchesSearch = res.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'no-show': return 'error';
            default: return 'info';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="All Reservations" size="xlarge">
            <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search by user or booking ID..."
                            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg focus:outline-none focus:border-[var(--accent-green)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant={filterStatus === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilterStatus('all')}>All</Button>
                        <Button variant={filterStatus === 'pending' ? 'primary' : 'outline'} size="sm" onClick={() => setFilterStatus('pending')}>Pending</Button>
                        <Button variant={filterStatus === 'confirmed' ? 'primary' : 'outline'} size="sm" onClick={() => setFilterStatus('confirmed')}>Confirmed</Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                            <tr>
                                <th className="p-3 font-medium">Booking ID</th>
                                <th className="p-3 font-medium">User</th>
                                <th className="p-3 font-medium">Facility</th>
                                <th className="p-3 font-medium">Date & Time</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 font-medium">Payment</th>
                                <th className="p-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                            {filteredReservations.map((res) => (
                                <tr key={res.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                                    <td className="p-3 font-medium text-[var(--text-primary)]">{res.id}</td>
                                    <td className="p-3">{res.user}</td>
                                    <td className="p-3 text-[var(--text-secondary)]">{res.facility}</td>
                                    <td className="p-3">
                                        <div className="flex flex-col text-xs">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {res.date}</span>
                                            <span className="flex items-center gap-1 text-[var(--text-muted)]"><Clock className="w-3 h-3" /> {res.time}</span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <Badge variant={getStatusVariant(res.status)}>
                                            {res.status}
                                        </Badge>
                                    </td>
                                    <td className="p-3">
                                        <span className={`text-xs font-medium ${res.payment === 'paid' ? 'text-green-500' : 'text-orange-500'}`}>
                                            {res.payment.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            {res.status === 'pending' && (
                                                <button
                                                    title="Confirm"
                                                    onClick={() => handleStatusChange(res.id, 'confirmed')}
                                                    className="p-1 hover:bg-green-500/10 text-green-500 rounded"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            <button
                                                title="Cancel"
                                                onClick={() => handleStatusChange(res.id, 'cancelled')}
                                                className="p-1 hover:bg-red-500/10 text-red-500 rounded"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredReservations.length === 0 && (
                    <div className="text-center py-8 text-[var(--text-secondary)]">
                        No reservations found matching your criteria.
                    </div>
                )}
            </div>
        </Modal>
    );
};
