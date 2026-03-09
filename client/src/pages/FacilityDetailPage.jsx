import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star, Users, MapPin, Check, Zap, Trophy, Loader } from 'lucide-react';
import { Navbar, Footer } from '../components/LandingPage';
import { Card, Button, Badge } from '../components/ui';
import { AuthModal } from '../components/AuthModal';
import { BookingSuccessModal, generateConfirmationCode } from '../components/BookingSuccessModal';
import { PublicAvailabilityCalendar } from '../components/PublicAvailabilityCalendar';
import { LocationSection } from '../components/LocationSection';
import { useAuth, API_BASE_URL } from '../contexts/AuthContext';

export const FacilityDetailPage = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const { token, isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [facility, setFacility] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const response = await fetch(`${API_BASE_URL || 'http://localhost:5000/api'}/reservations/facilities`);
        const data = await response.json();
        if (response.ok) {
          const found = data.find(f => (f._id || f.id).toString() === facilityId);
          if (found) {
            // Add fallback properties for the UI if DB is minimal
            found.images = found.images || ['📸', '🏟️', '⚡'];
            found.rating = found.rating || 4.5;
            found.reviews = found.reviews || 89;
            found.size = found.size || 'Standard Size';
            found.surface = found.surface || 'Standard Surface';
            found.amenities = found.amenities || ['Professional Court', 'Lighting', 'Parking'];
            found.price = found.hourly_rate || found.price || 500;
            found.icon = found.type === 'Basketball' ? '🏀' : found.type === 'Tennis' ? '🎾' : found.type === 'Badminton' ? '🏸' : '🏟️';
            setFacility(found);
          }
        }
      } catch (err) {
        console.error("Failed to fetch facility", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFacility();
  }, [facilityId]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
          <Loader className="w-12 h-12 animate-spin text-[var(--accent-green)]" />
        </div>
        <Footer />
      </>
    );
  }

  if (!facility) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6 pt-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Facility Not Found</h1>
            <p className="text-[var(--text-secondary)] mb-8">The facility you're looking for doesn't exist.</p>
            <Link to="/facilities">
              <Button variant="primary">Browse All Facilities</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleSlotSelect = async ({ date, startTime, endTime, duration }) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setIsBooking(true);
    try {
      const response = await fetch(`${API_BASE_URL || 'http://localhost:5000/api'}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          facility: facility._id,
          date,
          start_time: startTime,
          end_time: endTime,
          is_anonymous: false
        })
      });

      const result = await response.json();
      if (!response.ok) {
        alert(`Booking failed: ${result.message}`);
        setIsBooking(false);
        return;
      }

      // Success! Set the modal data
      const booking = {
        courtName: facility.name,
        courtId: facility._id,
        date,
        startTime,
        endTime,
        duration,
        totalPrice: duration * facility.price,
        confirmationCode: result._id // Use database ID as confirmation code, or generate one
      };

      setBookingData(booking);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book court. Please check your connection.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/facilities')}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Facilities</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <Card variant="elevated" className="overflow-hidden">
                <div className="h-96 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center">
                  <div className="text-9xl">{facility.icon}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 p-4 bg-[var(--bg-secondary)]">
                  {facility.images.map((img, idx) => (
                    <div key={idx} className="h-24 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center text-4xl">
                      {img}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Facility Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{facility.name}</h1>
                    <p className="text-xl text-[var(--text-secondary)]">{facility.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-[var(--warning)] fill-[var(--warning)]" />
                    <span className="text-2xl font-bold">{facility.rating}</span>
                    <span className="text-[var(--text-muted)]">({facility.reviews} reviews)</span>
                  </div>
                </div>

                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  {facility.description}
                </p>
              </div>

              {/* Quick Stats */}
              <Card variant="outlined" className="p-6">
                <h3 className="text-xl font-bold mb-4">Facility Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-[var(--text-muted)] text-sm mb-1">Price</div>
                    <div className="text-2xl font-bold text-[var(--accent-green)]">₱{facility.price}/hr</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)] text-sm mb-1">Capacity</div>
                    <div className="text-2xl font-bold">{facility.capacity} people</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)] text-sm mb-1">Court Size</div>
                    <div className="text-lg font-bold">{facility.size}</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)] text-sm mb-1">Surface</div>
                    <div className="text-lg font-bold">{facility.surface}</div>
                  </div>
                </div>
              </Card>

              {/* Amenities */}
              <Card variant="outlined" className="p-6">
                <h3 className="text-xl font-bold mb-4">Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {facility.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[rgba(0,255,136,0.1)] flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-[var(--accent-green)]" />
                      </div>
                      <span className="text-[var(--text-secondary)]">{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <div id="availability-calendar">
                <PublicAvailabilityCalendar
                  facility={facility}
                  onSlotSelect={handleSlotSelect}
                  isBooking={isBooking}
                />
              </div>

              {/* Location */}
              <LocationSection facility={facility} />
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card variant="glass" className="p-6">
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-[var(--accent-green)] mb-1">
                      ₱{facility.price}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">per hour</div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full !rounded-[var(--radius-md)] mb-4"
                    onClick={() => document.getElementById('availability-calendar')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Book Now
                  </Button>

                  <p className="text-xs text-center text-[var(--text-muted)] mb-4">
                    Select your time slots in the calendar below
                  </p>

                  <p className="text-xs text-center text-[var(--text-muted)]">
                    Free cancellation up to 24 hours before
                  </p>


                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        returnTo={`/facilities/${facilityId}`}
      />

      {/* Booking Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        booking={bookingData}
      />
    </>
  );
};
