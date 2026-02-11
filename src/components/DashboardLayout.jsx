import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Heart, 
  CreditCard, 
  User, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Navbar } from './LandingPage';

const NavItem = ({ icon: Icon, to, children, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all
        ${isActive 
          ? 'bg-[rgba(0,255,136,0.1)] text-[var(--accent-green)] font-medium' 
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="px-2 py-0.5 text-xs font-bold bg-[var(--accent-green)] text-[var(--bg-primary)] rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-[var(--bg-primary)] pt-18">
        {/* Centered Container */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-[var(--accent-green)] rounded-full flex items-center justify-center shadow-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar - Aligned with content grid */}
            <aside className={`
              w-64 flex-shrink-0
              md:sticky md:top-24 md:h-[calc(100vh-120px)]
              fixed md:relative top-18 left-0 h-[calc(100vh-72px)] 
              bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] 
              p-6 transition-transform duration-300 z-40
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
              <nav className="space-y-2">
                <NavItem icon={LayoutDashboard} to="/dashboard">
                  Overview
                </NavItem>
                <NavItem icon={Calendar} to="/dashboard/book">
                  Book a Court
                </NavItem>
                <NavItem icon={Clock} to="/dashboard/bookings" badge="3">
                  My Bookings
                </NavItem>
                <NavItem icon={Heart} to="/dashboard/favorites">
                  Favorites
                </NavItem>
                <NavItem icon={CreditCard} to="/dashboard/payments">
                  Payments
                </NavItem>
                <NavItem icon={User} to="/dashboard/profile">
                  Profile
                </NavItem>
                <NavItem icon={Settings} to="/dashboard/settings">
                  Settings
                </NavItem>
              </nav>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div
                className="md:hidden fixed inset-0 bg-black/50 z-30"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main Content - Flex grow to fill remaining space */}
            <main className="flex-1 py-12 min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[var(--text-muted)]">
          <p>© 2026 SportsPlex Manila. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};
