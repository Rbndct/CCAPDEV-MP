import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ReservationsPage } from './pages/admin/ReservationsPage';
import { FacilitiesManagementPage } from './pages/admin/FacilitiesManagementPage';
import { BookingsPage } from './pages/admin/BookingsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { StaffManagementPage } from './pages/admin/StaffManagementPage';
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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="reservations" element={<ReservationsPage />} />
              <Route path="staff" element={<StaffManagementPage />} />
              <Route path="facilities" element={<FacilitiesManagementPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="settings" element={<SettingsPage />} />
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
