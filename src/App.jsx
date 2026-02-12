import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { FacilityDetailPage } from './pages/FacilityDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PaymentPage } from './pages/PaymentPage';
import { ProfilePage } from './pages/ProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SettingsPage } from './pages/SettingsPage';
import { DashboardLayout } from './components/DashboardLayout';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { ReservationsPage } from './pages/admin/ReservationsPage';
import { FacilitiesManagementPage } from './pages/admin/FacilitiesManagementPage';
import { BookingsPage } from './pages/admin/BookingsPage';
import { StaffManagementPage } from './pages/admin/StaffManagementPage';
import { AdminSettingsPage } from './pages/admin/SettingsPage';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/facilities/:facilityId" element={<FacilityDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            {/* Dashboard Routes with Sidebar Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="book" element={<FacilitiesPage />} />
              <Route path="bookings" element={<DashboardPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="payments" element={<PaymentPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="reservations" element={<ReservationsPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="staff" element={<StaffManagementPage />} />
              <Route path="facilities" element={<FacilitiesManagementPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              {/* Add other admin routes here as needed */}
            </Route>
          </Routes>
          <ThemeToggle />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
