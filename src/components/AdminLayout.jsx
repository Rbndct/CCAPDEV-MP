import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Building2,
    CalendarDays,
    Menu,
    X,
    ClipboardList
} from 'lucide-react';
import { useState } from 'react';

export function AdminLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: <ClipboardList size={20} />, label: 'Reservations', path: '/admin/reservations' },
        { icon: <Users size={20} />, label: 'Staff Management', path: '/admin/staff' },
        { icon: <Building2 size={20} />, label: 'Facilities', path: '/admin/facilities' },
        { icon: <CalendarDays size={20} />, label: 'Bookings', path: '/admin/bookings' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)] flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[var(--bg-primary)] border-r border-[var(--border-subtle)]
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <span className="text-[var(--accent-green)]">Sports</span>Plex
                            <span className="text-xs bg-[var(--accent-green)] text-black px-2 py-0.5 rounded-full ml-1">ADMIN</span>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-1 hover:bg-[var(--bg-secondary)] rounded"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive(item.path)
                                        ? 'bg-[var(--accent-green)] text-black font-medium'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                                    }
                `}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-8 h-8 rounded-full bg-[var(--accent-green)] flex items-center justify-center font-bold text-black">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <div className="lg:hidden p-4 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 hover:bg-[var(--bg-secondary)] rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold">Admin Dashboard</span>
                    <div className="w-8" /> {/* Spacer for centering */}
                </div>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
