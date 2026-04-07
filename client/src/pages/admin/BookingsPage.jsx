import { useState, useEffect } from 'react';
import { Card, Button, Badge, Select, DatePicker } from '../../components/ui';
import { Filter, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Grid, List, Loader, Eye } from 'lucide-react';
import { useAuth, API_BASE_URL } from '../../contexts/AuthContext';
import { ViewDailyActivityModal } from '../../components/modals/ViewDailyActivityModal';

export function BookingsPage() {
    const { token } = useAuth();
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterFacility, setFilterFacility] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Activity modal state
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [activeDayBookings, setActiveDayBookings] = useState([]);
    const [activeDayDate, setActiveDayDate] = useState(null);

    // DB Data
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/reservations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    const mapped = data.map(r => ({
                        id: r._id,
                        facility: r.facility?.facility_name || r.facility?.name || 'Unknown',
                        user: r.user?.full_name || r.walk_in_name || 'Guest',
                        date: new Date(r.date).toISOString().split('T')[0],
                        startTime: r.start_time,
                        endTime: r.end_time,
                        status: r.status
                    }));
                    setBookings(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch bookings for calendar", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (token) fetchBookings();
    }, [token]);

    const [facilities, setFacilities] = useState([
        { value: 'all', label: 'All Facilities' }
    ]);

    useEffect(() => {
        const loadFacilities = async () => {
            try {
                const res = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/reservations/facilities`);
                const data = await res.json();
                if (res.ok) {
                    setFacilities([
                        { value: 'all', label: 'All Facilities' },
                        ...data.map(f => ({ value: f.facility_name || f.name, label: f.facility_name || f.name }))
                    ]);
                }
            } catch (e) {
                console.error("Failed to load facilities", e);
            }
        };
        loadFacilities();
    }, []);

    const statuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'pending', label: 'Pending' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const filteredBookings = bookings.filter(booking => {
        const matchesFacility = filterFacility === 'all' || booking.facility === filterFacility;
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        return matchesFacility && matchesStatus;
    });

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            default: return 'info';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500';
            case 'pending': return 'bg-orange-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    // Generate calendar days for current month
    const generateCalendarDays = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const getBookingsForDay = (day) => {
        if (!day) return [];
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return filteredBookings.filter(booking => booking.date === dateStr);
    };

    const changeMonth = (delta) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setSelectedDate(newDate);
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">All Bookings</h1>
                    <p className="text-[var(--text-secondary)]">View and manage all facility bookings</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={showFilters ? 'primary' : 'outline'}
                        className="gap-2"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={18} /> Filters
                    </Button>
                    <div className="flex gap-1 bg-[var(--bg-secondary)] rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-3 py-2 rounded transition-colors ${viewMode === 'calendar' ? 'bg-[var(--accent-green)] text-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 rounded transition-colors ${viewMode === 'list' ? 'bg-[var(--accent-green)] text-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <Card variant="elevated" className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            label="Facility"
                            value={filterFacility}
                            onChange={(e) => setFilterFacility(e.target.value)}
                            options={facilities}
                        />
                        <Select
                            label="Status"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            options={statuses}
                        />
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setFilterFacility('all');
                                    setFilterStatus('all');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
                <Card variant="elevated" className="p-6">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                        </h2>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>
                                <ChevronLeft size={18} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                                Today
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader className="w-8 h-8 animate-spin text-[var(--accent-green)]" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 gap-2">
                            {/* Day headers */}
                            {dayNames.map(day => (
                                <div key={day} className="text-center font-medium text-sm text-[var(--text-secondary)] py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {generateCalendarDays().map((day, index) => {
                                const dayBookings = getBookingsForDay(day);
                                const isToday = day &&
                                    day === new Date().getDate() &&
                                    selectedDate.getMonth() === new Date().getMonth() &&
                                    selectedDate.getFullYear() === new Date().getFullYear();

                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (day) {
                                                const year = selectedDate.getFullYear();
                                                const month = selectedDate.getMonth() + 1;
                                                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                setActiveDayDate(dateStr);
                                                setActiveDayBookings(dayBookings);
                                                setIsActivityModalOpen(true);
                                            }
                                        }}
                                        className={`min-h-[100px] p-2 rounded-lg border transition-all ${day
                                            ? 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-green)] hover:shadow-md cursor-pointer group'
                                            : 'bg-transparent border-transparent'
                                            } ${isToday ? 'ring-2 ring-[var(--accent-green)] border-[var(--accent-green)]' : ''}`}
                                    >
                                        {day && (
                                            <>
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className={`text-sm font-bold ${isToday ? 'text-[var(--accent-green)]' : ''}`}>
                                                        {day}
                                                    </div>
                                                    {dayBookings.length > 0 && (
                                                        <Eye size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-green)]" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    {dayBookings.slice(0, 3).map(booking => (
                                                        <div
                                                            key={booking.id}
                                                            className={`text-[10px] p-1 rounded-sm ${getStatusColor(booking.status)} text-white truncate font-medium`}
                                                            title={`${booking.facility} - ${booking.user} (${booking.startTime}-${booking.endTime})`}
                                                        >
                                                            {booking.startTime} {booking.facility.split(' ')[0]}
                                                        </div>
                                                    ))}
                                                    {dayBookings.length > 3 && (
                                                        <div className="text-[10px] text-[var(--text-muted)] pl-1 font-medium bg-[var(--bg-tertiary)] rounded-sm">
                                                            +{dayBookings.length - 3} others
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Legend */}
                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[var(--border-subtle)]">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">Status:</span>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-green-500"></div>
                            <span className="text-sm">Confirmed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-orange-500"></div>
                            <span className="text-sm">Pending</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-red-500"></div>
                            <span className="text-sm">Cancelled</span>
                        </div>
                    </div>
                </Card>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <Card variant="elevated" className="overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 flex justify-center items-center h-48">
                            <Loader className="w-8 h-8 animate-spin text-[var(--accent-green)]" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm">
                                    <tr>
                                        <th className="p-4 font-medium">Booking ID</th>
                                        <th className="p-4 font-medium">Facility</th>
                                        <th className="p-4 font-medium">User</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Time</th>
                                        <th className="p-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-subtle)]">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                                            <td className="p-4 font-medium">#{booking.id}</td>
                                            <td className="p-4">{booking.facility}</td>
                                            <td className="p-4 text-[var(--text-secondary)]">{booking.user}</td>
                                            <td className="p-4">{booking.date}</td>
                                            <td className="p-4 text-sm">{booking.startTime} - {booking.endTime}</td>
                                            <td className="p-4">
                                                <Badge variant={getStatusVariant(booking.status)}>
                                                    {booking.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!isLoading && filteredBookings.length === 0 && (
                        <div className="text-center py-12 text-[var(--text-secondary)]">
                            No bookings found matching your criteria.
                        </div>
                    )}
                </Card>
            )}
            {/* Activity Modal */}
            <ViewDailyActivityModal 
                isOpen={isActivityModalOpen} 
                onClose={() => setIsActivityModalOpen(false)} 
                date={activeDayDate}
                bookings={activeDayBookings}
            />
        </div>
    );
}
