import { useState } from 'react';
import { Card, Button, Badge, Select, DatePicker } from '../../components/ui';
import { Filter, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';

export function BookingsPage() {
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterFacility, setFilterFacility] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Mock bookings data
    const bookings = [
        { id: 1, facility: 'Basketball Court A', user: 'John Doe', date: '2026-02-12', startTime: '14:00', endTime: '16:00', status: 'confirmed' },
        { id: 2, facility: 'Tennis Court 1', user: 'Jane Smith', date: '2026-02-12', startTime: '10:00', endTime: '11:00', status: 'pending' },
        { id: 3, facility: 'Badminton Hall', user: 'Mike Ross', date: '2026-02-13', startTime: '09:00', endTime: '10:00', status: 'confirmed' },
        { id: 4, facility: 'Basketball Court A', user: 'Sarah Cole', date: '2026-02-14', startTime: '18:00', endTime: '20:00', status: 'confirmed' },
        { id: 5, facility: 'Tennis Court 2', user: 'Tom Hardy', date: '2026-02-15', startTime: '16:00', endTime: '17:00', status: 'pending' },
        { id: 6, facility: 'Volleyball Arena', user: 'Emma Watson', date: '2026-02-16', startTime: '15:00', endTime: '17:00', status: 'confirmed' },
    ];

    const facilities = [
        { value: 'all', label: 'All Facilities' },
        { value: 'Basketball Court A', label: 'Basketball Court A' },
        { value: 'Tennis Court 1', label: 'Tennis Court 1' },
        { value: 'Badminton Hall', label: 'Badminton Hall' },
        { value: 'Volleyball Arena', label: 'Volleyball Arena' },
        { value: 'Pickleball Arena', label: 'Pickleball Arena' },
    ];

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
                                    className={`min-h-[100px] p-2 rounded-lg border transition-colors ${day
                                            ? 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-green)] cursor-pointer'
                                            : 'bg-transparent border-transparent'
                                        } ${isToday ? 'ring-2 ring-[var(--accent-green)]' : ''}`}
                                >
                                    {day && (
                                        <>
                                            <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[var(--accent-green)]' : ''}`}>
                                                {day}
                                            </div>
                                            <div className="space-y-1">
                                                {dayBookings.slice(0, 3).map(booking => (
                                                    <div
                                                        key={booking.id}
                                                        className={`text-xs p-1 rounded ${getStatusColor(booking.status)} text-white truncate`}
                                                        title={`${booking.facility} - ${booking.user} (${booking.startTime}-${booking.endTime})`}
                                                    >
                                                        {booking.startTime} {booking.facility.split(' ')[0]}
                                                    </div>
                                                ))}
                                                {dayBookings.length > 3 && (
                                                    <div className="text-xs text-[var(--text-muted)] pl-1">
                                                        +{dayBookings.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

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
                    {filteredBookings.length === 0 && (
                        <div className="text-center py-12 text-[var(--text-secondary)]">
                            No bookings found matching your criteria.
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
