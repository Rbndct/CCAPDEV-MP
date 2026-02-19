import { CheckCircle, Copy, Download, Calendar as CalendarIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from './ui';
import { useState } from 'react';

export const BookingSuccessModal = ({ isOpen, onClose, booking }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !booking) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    // Mock download functionality
    console.log('Downloading receipt for:', booking.confirmationCode);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg animate-fade-in-up">
        <Card variant="glass" className="p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[rgba(0,255,136,0.1)] flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-[var(--accent-green)] animate-scale-in" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-center mb-2">
            Booking Confirmed!
          </h2>
          
          {/* Subheading */}
          <p className="text-center text-[var(--text-secondary)] mb-6">
            You're all set! We've reserved your court and sent a confirmation to your email.
          </p>

          {/* Booking Details Card */}
          <Card variant="outlined" className="p-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] text-sm">Court</span>
                <span className="font-semibold">{booking.courtName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] text-sm">Date</span>
                <span className="font-semibold">{formatDate(booking.date)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] text-sm">Time</span>
                <span className="font-semibold">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)} ({booking.duration}h)
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)] text-sm">Total</span>
                <span className="text-2xl font-bold text-[var(--accent-green)]">₱{booking.totalPrice}</span>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[var(--text-muted)] text-sm">Confirmation Code</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleCopyCode}
                    className="!p-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 text-center">
                  <code className="text-lg font-mono font-bold text-[var(--accent-green)]">
                    {booking.confirmationCode}
                  </code>
                  {copied && (
                    <p className="text-xs text-[var(--accent-green)] mt-1">Copied!</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link to="/dashboard" className="block">
              <Button variant="primary" className="w-full !rounded-[var(--radius-md)]">
                View My Bookings
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full !rounded-[var(--radius-md)]"
              onClick={handleDownloadReceipt}
              icon={<Download className="w-4 h-4" />}
            >
              Download Receipt
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-[var(--text-muted)]">
            Free cancellation up to 24 hours before your booking
          </p>
        </Card>
      </div>
    </div>
  );
};

// Utility function to generate confirmation codes
export const generateConfirmationCode = (booking) => {
  const date = booking.date.replace(/-/g, '').slice(2); // YYMMDD
  const court = booking.courtId.toString().toUpperCase();
  const time = booking.startTime.replace(':', '');
  return `SPX-${date}-${court}-${time}`;
};
