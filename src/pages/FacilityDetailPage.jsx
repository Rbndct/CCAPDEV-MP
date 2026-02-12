import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star, Users, MapPin, Check, Zap, Trophy } from 'lucide-react';
import { Navbar, Footer } from '../components/LandingPage';
import { Card, Button, Badge } from '../components/ui';
import { AuthModal } from '../components/AuthModal';
import { BookingSuccessModal, generateConfirmationCode } from '../components/BookingSuccessModal';
import { PublicAvailabilityCalendar } from '../components/PublicAvailabilityCalendar';
import { LocationSection } from '../components/LocationSection';

// Mock facility data (in real app, this would come from API/database)
const facilitiesData = {
  1: {
    id: 1,
    name: 'Court A - Premium Basketball',
    type: 'Basketball',
    icon: '🏀',
    price: 600,
    rating: 4.9,
    reviews: 127,
    capacity: 10,
    size: '28m x 15m',
    surface: 'Professional Hardwood',
    amenities: [
      'Air Conditioned',
      'Professional Grade Flooring',
      'Electronic Scoreboard',
      'Sound System',
      'Locker Rooms',
      'Showers',
      'Free Parking',
      'Equipment Rental',
      'Water Fountains',
      'Spectator Seating'
    ],
    description: 'Our premium indoor basketball court features professional-grade wooden flooring, state-of-the-art lighting, and climate control for optimal playing conditions. Perfect for competitive games, team practices, or casual pickup games.',
    images: ['🏀', '🎯', '🏆'],
    location: '123 Sports Ave, Metro Manila',
    availability: 'high'
  },
  2: {
    id: 2,
    name: 'Court B - Standard Basketball',
    type: 'Basketball',
    icon: '🏀',
    price: 500,
    rating: 4.5,
    reviews: 89,
    capacity: 10,
    size: '28m x 15m',
    surface: 'Standard Hardwood',
    amenities: [
      'Good Lighting',
      'Standard Equipment',
      'Locker Rooms',
      'Free Parking',
      'Water Fountains'
    ],
    description: 'Standard indoor basketball court perfect for casual games and practice sessions. Well-maintained with good lighting and standard equipment.',
    images: ['🏀', '⛹️', '🎯'],
    location: '123 Sports Ave, Metro Manila',
    availability: 'medium'
  },
  3: {
    id: 3,
    name: 'Court C - Tennis Court 1',
    type: 'Tennis',
    icon: '🎾',
    price: 500,
    rating: 4.8,
    reviews: 95,
    capacity: 4,
    size: '23.77m x 10.97m',
    surface: 'Hard Court',
    amenities: [
      'Professional Net',
      'Ball Machine Available',
      'Lighting for Night Play',
      'Locker Rooms',
      'Equipment Rental',
      'Free Parking'
    ],
    description: 'Indoor hard surface tennis court with professional-grade equipment. Suitable for singles and doubles matches with excellent lighting.',
    images: ['🎾', '🏆', '⭐'],
    location: '123 Sports Ave, Metro Manila',
    availability: 'high'
  },
  4: {
    id: 4,
    name: 'Court D - Tennis Court 2',
    type: 'Tennis',
    icon: '🎾',
    price: 500,
    rating: 4.9,
    reviews: 82,
    capacity: 4,
    size: '23.77m x 10.97m',
    surface: 'Clay Court',
    amenities: [
      'Tournament Grade',
      'Spectator Seating',
      'Premium Surface',
      'Locker Rooms',
      'Equipment Shop'
    ],
    description: 'Tournament-grade clay tennis court suitable for competitive matches. Features spectator seating and premium surface maintenance.',
    images: ['🎾', '🏟️', '👟'],
    location: '123 Sports Ave, Metro Manila',
    availability: 'low'
  },
  5: {
    id: 5,
    name: 'Court E - Badminton Hall',
    type: 'Badminton',
    icon: '🏸',
    price: 500,
    rating: 4.7,
    reviews: 156,
    capacity: 16,
    size: '13.4m x 6.1m (per court)',
    surface: 'Synthetic Mat',
    amenities: [
      '4 Courts',
      'High Ceiling',
      'Quality Nets',
      'Non-slip Flooring',
      'Air Conditioned'
    ],
    description: 'Spacious multi-court badminton facility featuring 4 professional courts with high ceilings and excellent anti-glare lighting.',
    images: ['🏸', '👟', '🏆'],
    location: '123 Sports Ave, Metro Manila',
    availability: 'high'
  },
  6: {
    id: 6,
    name: 'Court F - Volleyball Arena',
    type: 'Volleyball',
    icon: '🏐',
    price: 500,
    rating: 4.8,
    reviews: 112,
    capacity: 12,
    size: '18m x 9m',
    surface: 'Taraflex',
    amenities: [
      'Professional Court',
      'Adjustable Net',
      'Scoreboards',
      'Referee Stand',
      'Team Benches'
    ],
    description: 'Professional indoor volleyball court with regulation net and Taraflex flooring. ideal for team training and league matches.',
    images: ['🏐', '🥇', '🎽'],
    location: '123 Sports Ave, Metro Manila',
    availability: 'medium'
  },
  7: {
    id: 7,
    name: 'Court G - Multi-Purpose',
    type: 'Multi-Purpose',
    icon: '⚽',
    price: 500,
    rating: 4.6,
    reviews: 78,
    capacity: 20,
    size: '40m x 20m',
    surface: 'Polished Concrete',
    amenities: [
      'Convertible Setup',
      'Futsal Goals',
      'Basketball Hoops',
      'Sound System',
      'Bleachers'
    ],
    description: 'Versatile multi-purpose court suitable for futsal, basketball, volleyball, and large group activities. Flexible configuration options available.',
    images: ['⚽', '🥅', '📢'],
    location: '123 Sports Ave, Metro Manila',
    availability: 'high'
  },
  8: {
    id: 8,
    name: 'Court H - Pickleball Arena',
    type: 'Pickleball',
    icon: '🏓',
    price: 500,
    rating: 4.9,
    reviews: 45,
    capacity: 8,
    size: '13.4m x 6.1m',
    surface: 'Hard Court',
    amenities: [
      'Professional Court',
      'Paddle Rental',
      'Good Lighting',
      'Lounge Area',
      'Pro Shop'
    ],
    description: 'Dedicated pickleball facility with professional surfacing and acoustically treated walls. Perfect for the growing community of pickleball enthusiasts.',
    images: ['🏓', '🤝', '🥤'],
    location: '123 Sports Ave, Metro Manila',
    availability: 'high'
  }
};

export const FacilityDetailPage = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const facility = facilitiesData[facilityId];

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

  const handleSlotSelect = ({ date, startTime, endTime, duration }) => {
    const booking = {
      courtName: facility.name,
      courtId: facility.id,
      date,
      startTime,
      endTime,
      duration,
      totalPrice: duration * facility.price,
      confirmationCode: generateConfirmationCode({
        date,
        courtId: facility.id.toString(),
        startTime
      })
    };

    setBookingData(booking);
    setShowSuccessModal(true);
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

              {/* Availability Calendar */}
              <div id="availability-calendar">
                <PublicAvailabilityCalendar
                  facility={facility}
                  onSlotSelect={handleSlotSelect}
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

                  {/* Quick Info */}
                  <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Zap className="w-4 h-4 text-[var(--accent-green)]" />
                      <span className="text-[var(--text-secondary)]">Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Trophy className="w-4 h-4 text-[var(--accent-green)]" />
                      <span className="text-[var(--text-secondary)]">Professional equipment</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="w-4 h-4 text-[var(--accent-green)]" />
                      <span className="text-[var(--text-secondary)]">Up to {facility.capacity} players</span>
                    </div>
                  </div>
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
