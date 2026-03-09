import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { Search, Filter, Calendar, Clock, MapPin, MoreVertical, X, Check, Archive, Pencil, AlertTriangle } from 'lucide-react';
import { EditReservationModal } from '../../components/modals/EditReservationModal';
import { useAuth, API_BASE_URL } from '../../contexts/AuthContext';

export function ReservationsPage() {
    const { token } = useAuth();
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showArchived, setShowArchived] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Helper function to check if booking is older than 2 days
    const isOlderThanTwoDays = (dateString) => {
        const bookingDate = new Date(dateString);
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        return bookingDate < twoDaysAgo;
    };

    // Mock Reservations Data
    const [reservations, setReservations] = useState([]);

    const fetchReservations = async () => {
        try {
            const response = await fetch(`${API_BASE_URL || 'http://localhost:5000/api'}/admin/reservations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                // Map to frontend expected format
                const mapped = data.map(r => ({
                    id: r._id,
                    user: r.user?.full_name || r.walk_in_name || 'Guest',
                    facility: r.facility?.name || 'Unknown',
                    date: new Date(r.date).toISOString().split('T')[0],
                    time: `${r.start_time} - ${r.end_time}`,
                    status: r.status,
                    payment: r.payment_status || 'paid', // Default to paid if not set
                    archived: false // Default to unarchived
                }));
                setReservations(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch reservations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchReservations();
    }, [token]);

    const handleStatusChange = async (id, newStatus) => {
        // Optimistic update
        setReservations(reservations.map(res =>
            res.id === id ? { ...res, status: newStatus } : res
        ));

        try {
            await fetch(`${API_BASE_URL || 'http://localhost:5000/api'}/admin/reservations/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (error) {
            console.error("Failed to update status:", error);
            // Revert back on error (omitted for brevity)
        }
    };

    const handleArchive = (id) => {
        setReservations(reservations.map(res =>
            res.id === id ? { ...res, archived: true } : res
        ));
    };

    const handleUnarchive = (id) => {
        setReservations(reservations.map(res =>
            res.id === id ? { ...res, archived: false } : res
        ));
    };

    const handleEdit = (reservation) => {
        // The modal expects 'court' property but reservation has 'facility', map it
        const bookingForModal = {
            ...reservation,
            court: reservation.facility
        };
        setEditingReservation(bookingForModal);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedBooking) => {
        // Will refresh the list after edit via the modal's save mechanism
        fetchReservations();
    };

    const handleBulkArchive = () => {
        const archivableIds = reservations
            .filter(res => !res.archived && isOlderThanTwoDays(res.date))
            .map(res => res.id);

        if (archivableIds.length === 0) {
            alert('No reservations found that are older than 2 days.');
            return;
        }

        if (window.confirm(`Are you sure you want to archive ${archivableIds.length} reservations?`)) {
            setReservations(reservations.map(res =>
                archivableIds.includes(res.id) ? { ...res, archived: true } : res
            ));
        }
    };

    const filteredReservations = reservations.filter(res => {
        const matchesStatus = filterStatus === 'all' || res.status === filterStatus;
        const matchesSearch = res.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesArchiveFilter = showArchived ? res.archived : !res.archived;
        return matchesStatus && matchesSearch && matchesArchiveFilter;
    });

    // Count bookings that can be archived
    const archivableCount = reservations.filter(res =>
        !res.archived && isOlderThanTwoDays(res.date)
    ).length;

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'no-show': return 'warning';
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
                <div className="flex gap-2 flex-wrap">
                    <Button variant={filterStatus === 'all' ? 'primary' : 'outline'} onClick={() => setFilterStatus('all')}>All</Button>
                    <Button variant={filterStatus === 'pending' ? 'primary' : 'outline'} onClick={() => setFilterStatus('pending')}>Pending</Button>
                    <Button variant={filterStatus === 'confirmed' ? 'primary' : 'outline'} onClick={() => setFilterStatus('confirmed')}>Confirmed</Button>
                    <Button
                        variant="outline"
                        className="gap-2 border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                        onClick={handleBulkArchive}
                    >
                        <Archive size={16} />
                        Bulk Archive Older
                    </Button>
                    <Button
                        variant={showArchived ? 'primary' : 'outline'}
                        className="gap-2"
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        <Archive size={16} />
                        {showArchived ? 'Show Active' : `Archived (${reservations.filter(r => r.archived).length})`}
                    </Button>
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="p-4 text-center text-[var(--text-secondary)]">Loading reservations...</td>
                                </tr>
                            ) : filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-4 text-center text-[var(--text-secondary)]">No reservations found.</td>
                                </tr>
                            ) : (
                                filteredReservations.map((res) => (
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
                                                {!showArchived && (
                                                    <>
                                                        <button
                                                            title="Edit Reservation"
                                                            onClick={() => handleEdit(res)}
                                                            className="p-1 hover:bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded transition-colors"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            title="Confirm Reservation"
                                                            onClick={() => handleStatusChange(res.id, 'confirmed')}
                                                            className={`p-1 rounded transition-colors ${res.status === 'confirmed'
                                                                ? 'bg-green-500/20 text-green-500 ring-1 ring-green-500/30'
                                                                : 'hover:bg-green-500/10 text-green-500'
                                                                }`}
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            title="Mark No-Show"
                                                            onClick={() => handleStatusChange(res.id, 'no-show')}
                                                            className={`p-1 rounded transition-colors ${res.status === 'no-show'
                                                                ? 'bg-orange-500/20 text-orange-500 ring-1 ring-orange-500/30'
                                                                : 'hover:bg-orange-500/10 text-orange-500'
                                                                }`}
                                                        >
                                                            <AlertTriangle size={18} />
                                                        </button>
                                                        <button
                                                            title="Cancel Reservation"
                                                            onClick={() => handleStatusChange(res.id, 'cancelled')}
                                                            className={`p-1 rounded transition-colors ${res.status === 'cancelled'
                                                                ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/30'
                                                                : 'hover:bg-red-500/10 text-red-500'
                                                                }`}
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                        <button
                                                            title="Archive booking"
                                                            onClick={() => handleArchive(res.id)}
                                                            className="p-1 hover:bg-blue-500/10 text-blue-500 rounded transition-colors"
                                                        >
                                                            <Archive size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                {showArchived && (
                                                    <button
                                                        title="Unarchive booking"
                                                        onClick={() => handleUnarchive(res.id)}
                                                        className="p-1 hover:bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded transition-colors"
                                                    >
                                                        <Archive size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <EditReservationModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setEditingReservation(null); }}
                booking={editingReservation}
                onSave={handleSaveEdit}
            />
        </div>
    );
}
