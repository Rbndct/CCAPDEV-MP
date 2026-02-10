import { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { Search, Filter, Calendar, Clock, MapPin, MoreVertical, X, Check } from 'lucide-react';

export function ReservationsPage() {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Reservations Data
    const [reservations, setReservations] = useState([
        { id: 'R-1001', user: 'John Doe', facility: 'Basketball Court A', date: '2026-02-12', time: '14:00 - 16:00', status: 'confirmed', payment: 'paid' },
        { id: 'R-1002', user: 'Jane Smith', facility: 'Tennis Court 1', date: '2026-02-15', time: '10:00 - 11:00', status: 'pending', payment: 'unpaid' },
        { id: 'R-1003', user: 'Mike Ross', facility: 'Badminton Hall', date: '2026-02-10', time: '09:00 - 10:00', status: 'no-show', payment: 'paid' },
        { id: 'R-1004', user: 'Sarah Cole', facility: 'Volleyball Arena', date: '2026-02-14', time: '18:00 - 20:00', status: 'confirmed', payment: 'paid' },
        { id: 'R-1005', user: 'Tom Hardy', facility: 'Basketball Court B', date: '2026-02-11', time: '16:00 - 17:00', status: 'cancelled', payment: 'refunded' },
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
            case 'no-show': return 'error'; // Or a specific dark red
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Manage Reservations</h1>
                    <p className="text-[var(--text-secondary)]">View and manage all facility bookings</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={filterStatus === 'all' ? 'primary' : 'outline'} onClick={() => setFilterStatus('all')}>All</Button>
                    <Button variant={filterStatus === 'pending' ? 'primary' : 'outline'} onClick={() => setFilterStatus('pending')}>Pending</Button>
                    <Button variant={filterStatus === 'confirmed' ? 'primary' : 'outline'} onClick={() => setFilterStatus('confirmed')}>Confirmed</Button>
                </div>
            </div>

            <Card variant="elevated">
                {/* Toolbar */}
                <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search by user or booking ID..."
                            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg focus:outline-none focus:border-[var(--accent-green)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" /> More Filters
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm">
                            <tr>
                                <th className="p-4 font-medium">Booking ID</th>
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Facility</th>
                                <th className="p-4 font-medium">Date & Time</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Payment</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                            {filteredReservations.map((res) => (
                                <tr key={res.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                                    <td className="p-4 font-medium text-[var(--text-primary)]">{res.id}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-[var(--accent-green)] text-black flex items-center justify-center text-xs font-bold">
                                                {res.user.charAt(0)}
                                            </div>
                                            {res.user}
                                        </div>
                                    </td>
                                    <td className="p-4 text-[var(--text-secondary)]">{res.facility}</td>
                                    <td className="p-4 text-sm">
                                        <div className="flex flex-col">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {res.date}</span>
                                            <span className="flex items-center gap-1 text-[var(--text-muted)]"><Clock className="w-3 h-3" /> {res.time}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={getStatusVariant(res.status)}>
                                            {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-sm font-medium ${res.payment === 'paid' ? 'text-green-500' : 'text-orange-500'}`}>
                                            {res.payment.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {res.status === 'pending' && (
                                                <button
                                                    title="Confirm"
                                                    onClick={() => handleStatusChange(res.id, 'confirmed')}
                                                    className="p-1 hover:bg-green-500/10 text-green-500 rounded"
                                                >
                                                    <Check size={18} />
                                                </button>
                                            )}
                                            <button
                                                title="Mark No-Show"
                                                onClick={() => handleStatusChange(res.id, 'no-show')}
                                                className="p-1 hover:bg-orange-500/10 text-orange-500 rounded"
                                            >
                                                <Clock size={18} />
                                            </button>
                                            <button
                                                title="Cancel"
                                                onClick={() => handleStatusChange(res.id, 'cancelled')}
                                                className="p-1 hover:bg-red-500/10 text-red-500 rounded"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
