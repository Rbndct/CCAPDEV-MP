import { X } from 'lucide-react';
import { Card, Button, Badge } from './ui';

export const FacilityPreviewModal = ({ isOpen, onClose, facility }) => {
  if (!isOpen || !facility) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl animate-fade-in-up">
        <Card variant="glass" className="p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="text-8xl">{facility.icon}</div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">{facility.name}</h2>
            <Badge variant="warning" className="mb-4">Full details coming soon</Badge>
            <p className="text-[var(--text-secondary)]">{facility.description}</p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="text-2xl font-bold text-[var(--accent-green)]">₱{facility.price}</div>
              <div className="text-sm text-[var(--text-muted)]">per hour</div>
            </div>
            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="text-2xl font-bold">{facility.capacity}</div>
              <div className="text-sm text-[var(--text-muted)]">capacity</div>
            </div>
          </div>

          {/* Amenities Preview */}
          {facility.amenities && facility.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Amenities Preview</h3>
              <div className="flex flex-wrap gap-2">
                {facility.amenities.slice(0, 5).map((amenity, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-3 py-1 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-muted)]"
                  >
                    {amenity}
                  </span>
                ))}
                {facility.amenities.length > 5 && (
                  <span className="text-xs px-3 py-1 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-muted)]">
                    +{facility.amenities.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          <div className="p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--accent-green)] rounded-lg mb-6">
            <p className="text-sm text-center">
              🚧 We're building a comprehensive page for this facility. Check back soon for photos, full amenities list, and booking calendar!
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onClose}>
              Back to Facilities
            </Button>
            <Button variant="primary" onClick={onClose}>
              Quick Book
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
