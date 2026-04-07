import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { Users, DollarSign, Calendar, TrendingUp, ArrowRight, AlertTriangle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ViewAllReservationsModal } from '../../components/modals/ViewAllReservationsModal';
import { ViewNoShowsModal } from '../../components/modals/ViewNoShowsModal';
import { NewBookingModal } from '../../components/modals/NewBookingModal';

import { useAuth, API_BASE_URL } from '../../contexts/AuthContext';

export function AdminDashboardPage() {
    const { token } = useAuth();
    const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
    const [isNoShowsModalOpen, setIsNoShowsModalOpen] = useState(false);
    const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);


    const [recentUsers, setRecentUsers] = useState([]);
    const [statsData, setStatsData] = useState({
        revenue: 0,
        activeBookings: 0,
        noShows: 0,
        occupancyRate: 0
    });
    const [noShowAlerts, setNoShowAlerts] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const [userRes, statsRes, resRes] = await Promise.all([
                fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/reservations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (userRes.ok) {
                const userData = await userRes.json();
                setRecentUsers(userData.slice(0, 5));
            }

            if (statsRes.ok) {
                const sd = await statsRes.json();
                setStatsData({
                    revenue: sd.totalRevenue || 0,
                    activeBookings: sd.activeBookings || 0,
                    noShows: sd.noShows || 0,
                    occupancyRate: sd.occupancyRate || 0
                });
            }

            if (resRes.ok) {
                const resData = await resRes.json();
                const unresolvedNoShows = resData.filter(r => r.status === 'no-show' && !r.resolved_no_show);
                setNoShowAlerts(unresolvedNoShows.slice(0, 3));
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    };

    useEffect(() => {
        if (token) fetchDashboardData();
    }, [token]);

    const stats = [
        { label: 'Total Revenue', value: `₱${statsData.revenue.toLocaleString()}`, change: '+12%', icon: DollarSign, color: 'text-green-500' },
        { label: 'Occupancy Rate', value: `${statsData.occupancyRate}%`, change: '+5%', icon: TrendingUp, color: 'text-blue-500' },
        { label: 'Active Bookings', value: statsData.activeBookings.toString(), change: '+18%', icon: Calendar, color: 'text-purple-500' },
        { label: 'Unresolved No-Shows', value: statsData.noShows.toString(), change: '-2%', icon: AlertTriangle, color: 'text-orange-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                    <p className="text-[var(--text-secondary)]">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="primary" className="gap-2" onClick={() => setIsNewBookingModalOpen(true)}>
                        <Plus size={18} /> New Booking
                    </Button>

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} variant="elevated" className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-[var(--bg-secondary)] ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-[var(--text-secondary)] text-sm mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card variant="elevated" className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Recent Signups</h3>
                        <Link to="/admin/users">
                            <Button variant="ghost" size="sm" className="gap-2">
                                View All <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentUsers.length > 0 ? (
                            recentUsers.map((user) => (
                                <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[var(--accent-green)] text-black flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {user.full_name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{user.full_name}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-right">
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : user.role === 'staff' ? 'bg-blue-500/10 text-blue-400' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'}`}>
                                            {user.role || 'student'}
                                        </span>
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)]">{new Date(user.created_at).toLocaleDateString()}</p>
                                            <p className="text-xs text-[var(--accent-green)] font-medium">{user.booking_count || 0} booking{user.booking_count !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[var(--text-muted)] py-4">No recent signups</p>
                        )}
                    </div>
                </Card>

                <Card variant="elevated" className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">No-Show Alerts</h3>
                        <Button variant="ghost" size="sm" className="gap-2" onClick={() => setIsNoShowsModalOpen(true)}>
                            View All <ArrowRight size={16} />
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {noShowAlerts.length > 0 ? (
                            noShowAlerts.map((alert) => (
                                <div key={alert._id} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <div className="flex items-start justify-between mb-1">
                                        <p className="font-medium text-red-400 text-sm">{alert.facility?.facility_name || alert.facility?.name || 'Court'} missed</p>
                                        <Badge variant="error" size="sm">No-Show</Badge>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {alert.user?.full_name || alert.walk_in_name || 'Guest'} · {new Date(alert.date).toLocaleDateString()} {alert.start_time}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center text-sm text-[var(--text-secondary)]">
                                No new no-show alerts
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Modals */}
            <ViewAllReservationsModal isOpen={isViewAllModalOpen} onClose={() => setIsViewAllModalOpen(false)} />
            <ViewNoShowsModal isOpen={isNoShowsModalOpen} onClose={() => setIsNoShowsModalOpen(false)} onResolve={fetchDashboardData} />
            <NewBookingModal isOpen={isNewBookingModalOpen} onClose={() => setIsNewBookingModalOpen(false)} />

        </div>
    );
}
