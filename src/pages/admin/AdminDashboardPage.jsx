import { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { Users, DollarSign, Calendar, TrendingUp, ArrowRight, AlertTriangle, Plus, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ViewAllReservationsModal } from '../../components/modals/ViewAllReservationsModal';
import { NewBookingModal } from '../../components/modals/NewBookingModal';
import { BlockSlotModal } from '../../components/modals/BlockSlotModal';

export function AdminDashboardPage() {
    const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
    const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
    const [isBlockSlotModalOpen, setIsBlockSlotModalOpen] = useState(false);

    const stats = [
        { label: 'Total Revenue', value: '₱124,500', change: '+12%', icon: DollarSign, color: 'text-green-500' },
        { label: 'Occupancy Rate', value: '85%', change: '+5%', icon: TrendingUp, color: 'text-blue-500' },
        { label: 'Active Bookings', value: '45', change: '+18%', icon: Calendar, color: 'text-purple-500' },
        { label: 'No-Shows', value: '3', change: '-2%', icon: AlertTriangle, color: 'text-orange-500' },
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
                    <Button variant="outline" className="gap-2" onClick={() => setIsBlockSlotModalOpen(true)}>
                        <Lock size={18} /> Block Slot
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
                        <Button variant="ghost" size="sm" className="gap-2" onClick={() => setIsViewAllModalOpen(true)}>
                            View All <ArrowRight size={16} />
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] flex items-center justify-center font-bold">
                                        U{i}
                                    </div>
                                    <div>
                                        <p className="font-medium">New User {i}</p>
                                        <p className="text-xs text-[var(--text-muted)]">user{i}@example.com</p>
                                    </div>
                                </div>
                                <span className="text-xs text-[var(--text-muted)]">2 mins ago</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card variant="elevated" className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">No-Show Alerts</h3>
                        <Button variant="ghost" size="sm" className="gap-2">
                            View All <ArrowRight size={16} />
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <div className="flex items-start justify-between mb-1">
                                    <p className="font-medium text-red-400">Court reservation missed</p>
                                    <Badge variant="error" size="sm">No-Show</Badge>
                                </div>
                                <p className="text-xs text-[var(--text-muted)]">User: John Doe • 10:00 AM</p>
                            </div>
                        ))}
                        <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center text-sm text-[var(--text-secondary)]">
                            No other alerts for today
                        </div>
                    </div>
                </Card>
            </div>

            {/* Modals */}
            <ViewAllReservationsModal isOpen={isViewAllModalOpen} onClose={() => setIsViewAllModalOpen(false)} />
            <NewBookingModal isOpen={isNewBookingModalOpen} onClose={() => setIsNewBookingModalOpen(false)} />
            <BlockSlotModal isOpen={isBlockSlotModalOpen} onClose={() => setIsBlockSlotModalOpen(false)} />
        </div>
    );
}
