import { X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui';
import { useAuth } from '../contexts/AuthContext';

export const AuthModal = ({ isOpen, onClose, returnTo = null }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate('/login', { state: { returnTo } });
  };

  const handleSignup = () => {
    navigate('/signup', { state: { returnTo } });
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="glass border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>

          {/* Content */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--accent-green)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏀</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Login to Complete Booking</h2>
            <p className="text-[var(--text-secondary)]">
              Create an account or login to reserve this court
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              variant="primary" 
              className="w-full !rounded-[var(--radius-md)]"
              onClick={handleLogin}
            >
              Login to Continue
            </Button>
            <Button 
              variant="outline" 
              className="w-full !rounded-[var(--radius-md)]"
              onClick={handleSignup}
            >
              Create New Account
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={handleClose}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors"
            >
              Continue browsing without booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
