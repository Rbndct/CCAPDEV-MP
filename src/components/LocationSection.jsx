import { MapPin, Navigation, Eye, Copy, Car, Train } from 'lucide-react';
import { Card, Button } from './ui';
import { useState } from 'react';

export const LocationSection = ({ facility }) => {
  const [copied, setCopied] = useState(false);

  const address = facility?.location || '123 Sports Avenue, Makati City, Metro Manila 1200';
  const facilityName = facility?.name || 'SportsPlex Manila';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(address);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = `maps://maps.google.com/maps?daddr=${encodedAddress}`;
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    }
  };

  const handleStreetView = () => {
    // Using approximate Makati coordinates
    const coords = "14.5547,121.0244";
    window.open(`https://www.google.com/maps/@${coords},3a,75y,90t/data=!3m6!1e1`, '_blank');
  };



  // Public Transport
  const handlePublicTransport = () => {
    const encodedAddress = encodeURIComponent(address);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          window.open(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodedAddress}&travelmode=transit`, '_blank');
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback if location access denied
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=transit`, '_blank');
        }
      );
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=transit`, '_blank');
    }
  };

  return (
    <Card variant="outlined" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Location & Directions</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-[rgba(0,255,136,0.1)] rounded-full">
          <MapPin className="w-3 h-3 text-[var(--accent-green)]" />
          <span className="text-xs font-medium text-[var(--accent-green)]">Makati City</span>
        </div>
      </div>

      {/* Address Card */}
      <div className="glass p-4 rounded-lg mb-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[var(--accent-green)] flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-semibold mb-1">{facilityName}</p>
            <p className="text-sm text-[var(--text-muted)]">{address}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopyAddress}
            className="!p-2"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        {copied && (
          <p className="text-xs text-[var(--accent-green)] mt-2 text-center">Address copied!</p>
        )}
      </div>

      {/* Map Embed */}
      <div className="map-wrapper rounded-lg overflow-hidden mb-4 bg-[var(--bg-tertiary)]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.4087524729744!2d121.02240931483!3d14.554729989827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90264a0ed31%3A0x2b50f15d0a805f8!2sMakati%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1234567890"
          className="w-full h-80 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Facility Location Map"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button 
          variant="primary" 
          onClick={handleGetDirections}
          icon={<Navigation className="w-4 h-4" />}
        >
          Get Directions
        </Button>
        <Button 
          variant="outline" 
          onClick={handleStreetView}
          icon={<Eye className="w-4 h-4" />}
        >
          Street View
        </Button>
      </div>

      {/* Parking Info */}
      <div className="glass p-4 rounded-lg mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Car className="w-4 h-4 text-[var(--accent-green)]" />
          <span className="font-semibold text-sm">Parking Available</span>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          67 parking slots • Free for customers • Basement Level 67
        </p>
      </div>

      {/* Public Transport */}
      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Train className="w-4 h-4 text-[var(--accent-green)]" />
          <span className="font-semibold text-sm">Public Transport</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Find the best route from your current location via bus, train, or jeepney.
        </p>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full"
          onClick={handlePublicTransport}
          icon={<Navigation className="w-3 h-3" />}
        >
          Get Transit Route
        </Button>
      </div>
    </Card>
  );
};
