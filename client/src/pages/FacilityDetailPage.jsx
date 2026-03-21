import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star, Users, MapPin, Check, Zap, Trophy, Loader, Heart } from 'lucide-react';
import { Navbar, Footer } from '../components/LandingPage';
import { Card, Button, Badge } from '../components/ui';
import { AuthModal } from '../components/AuthModal';
import { BookingSuccessModal } from '../components/BookingSuccessModal';
import { PublicAvailabilityCalendar } from '../components/PublicAvailabilityCalendar';
import { LocationSection } from '../components/LocationSection';
import { useAuth, API_BASE_URL } from '../contexts/AuthContext';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 bg-red-100 text-red-700 rounded-lg">
          <h2 className="font-bold">Something went wrong in this component: {this.props.name}</h2>
          <pre className="text-sm mt-2">{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const getAmenityStyle = (amenity) => {
  const lower = amenity.toLowerCase();
  
  if (lower.includes('professional') || lower.includes('grade') || lower.includes('surface') || lower.includes('court') || lower.includes('premium') || lower.includes('tournament') || lower.includes('standard')) {
    return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
  }
  if (lower.includes('air') || lower.includes('lounge') || lower.includes('seating') || lower.includes('ceiling') || lower.includes('bleacher')) {
    return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
  }
  if (lower.includes('scoreboard') || lower.includes('machine') || lower.includes('net') || lower.includes('lighting') || lower.includes('equipment') || lower.includes('floodlight') || lower.includes('ball') || lower.includes('paddle')) {
    return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
  }
  if (lower.includes('rental') || lower.includes('parking') || lower.includes('room') || lower.includes('locker') || lower.includes('shower') || lower.includes('water')) {
    return 'bg-teal-500/10 text-teal-500 border border-teal-500/20';
  }
  if (lower.includes('setup') || lower.includes('sports') || lower.includes('convertible') || lower.includes('option') || lower.includes('flexible')) {
    return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
  }

  return 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-subtle)]';
};

export const FacilityDetailPage = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const { token, isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [availabilityRefreshKey, setAvailabilityRefreshKey] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [facility, setFacility] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '', isAnonymous: false });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reservations/facilities/${facilityId}`);
        if (response.ok) {
          const found = await response.json();
          if (found) {
            // Normalize MongoDB field names to what the UI expects
            const normalized = {
              ...found,
              name: found.facility_name,
              type: found.facility_type,
              description: found.facility_description,
              capacity: found.total_capacity,
              price: found.hourly_rate_php,
              amenities: found.facility_amenities || [],
              surface: found.facility_surface || 'Standard Surface',
              size: found.facility_size || 'Standard Size',
              images: found.facility_images?.length ? found.facility_images : ['📸', '🏟️', '⚡'],
              rating: 'New', // will be computed from real reviews
              reviews: 0,
              icon: found.facility_type === 'Basketball' ? '🏀'
                  : found.facility_type === 'Tennis' ? '🎾'
                  : found.facility_type === 'Badminton' ? '🏸'
                  : found.facility_type === 'Volleyball' ? '🏐'
                  : found.facility_type === 'Swimming' ? '🏊'
                  : found.facility_type === 'Gym' ? '🏋️'
                  : found.facility_type === 'Pickleball' ? '🏓'
                  : found.facility_type === 'Futsal' ? '⚽'
                  : found.facility_type === 'Table Tennis' ? '🏓'
                  : '🏟️',
            };
            setFacility(normalized);
            
            try {
              const schedRes = await fetch(`${API_BASE_URL}/reservations/facilities/${facilityId}/schedule`);
              if (schedRes.ok) {
                const schedData = await schedRes.json();
                setSchedule(schedData);
              }
            } catch (err) {
              console.error("Failed to fetch schedule", err);
            }
            try {
              const reviewsRes = await fetch(`${API_BASE_URL}/reservations/facilities/${facilityId}/reviews`);
              if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);
                if (reviewsData.length > 0) {
                   const avg = reviewsData.reduce((acc, curr) => acc + curr.rating, 0) / reviewsData.length;
                   normalized.rating = avg.toFixed(1);
                   normalized.reviews = reviewsData.length;
                }
              }
            } catch (err) { console.error("Failed to fetch reviews", err); }
            
            setFacility(normalized);
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

  useEffect(() => {
    if (isLoggedIn && token && facilityId) {
      const checkCanReview = async () => {
        try {
          const myRes = await fetch(`${API_BASE_URL}/reservations/my`, {
             headers: { 'Authorization': `Bearer ${token}` }
          });
          if (myRes.ok) {
             const myData = await myRes.json();
             const hasPast = myData.some(r => {
               const fid = (r.facility && r.facility._id) ? r.facility._id : r.facility;
               return fid === facilityId && new Date(r.date) < new Date() && ['reserved', 'completed'].includes(r.status);
             });
             setCanReview(hasPast);
          }
        } catch (err) { console.error(err); }
      };
      checkCanReview();

      // Check if favorited
      const checkFavorite = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/profiles/me/favorites`, {
             headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
             const favs = await res.json();
             setIsFavorite(favs.some(f => (f._id || f) === facilityId));
          }
        } catch (err) { console.error(err); }
      };
      checkFavorite();

    } else {
      setCanReview(false);
      setIsFavorite(false);
    }
  }, [isLoggedIn, token, facilityId]);

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
      const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/reservations`, {
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
        totalPrice: duration * (facility.price || 0),
        confirmationCode: result._id
      };

      setBookingData(booking);
      setShowSuccessModal(true);
      setAvailabilityRefreshKey(k => k + 1); // refresh calendar so new booking shows as taken
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book court. Please check your connection.");
    } finally {
      setIsBooking(false);
    }
  };


  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewError('');
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/facilities/${facilityId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          title: reviewForm.title,
          body: reviewForm.body,
          is_anonymous: reviewForm.isAnonymous
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.message || 'Failed to submit review');
      } else {
        setReviewForm({ rating: 5, title: '', body: '', isAnonymous: false });
        setCanReview(false);

        // Re-fetch so the aggregate rating + review list stay consistent with the backend.
        const reviewsRes = await fetch(`${API_BASE_URL}/reservations/facilities/${facilityId}/reviews`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
          if (reviewsData?.length) {
            const avg = reviewsData.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) / reviewsData.length;
            setFacility(prev => ({ ...prev, reviews: reviewsData.length, rating: avg.toFixed(1) }));
          }
        }
      }
    } catch (err) {
      setReviewError('An error occurred. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/profiles/me/favorites/${facilityId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
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

              <ErrorBoundary name="PublicAvailabilityCalendar">
                <div id="availability-calendar">
                  <PublicAvailabilityCalendar
                    facility={facility}
                    onSlotSelect={handleSlotSelect}
                    isBooking={isBooking}
                    refreshKey={availabilityRefreshKey}
                  />
                </div>
              </ErrorBoundary>

              {/* Location */}
              <ErrorBoundary name="LocationSection">
                <LocationSection facility={facility} />
              </ErrorBoundary>

              {/* Reviews Section */}
              <ErrorBoundary name="ReviewsSection">
              <div className="mt-12 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Reviews</h3>
                  <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-4 py-2 rounded-full border border-[var(--border-subtle)]">
                     <Star className="w-5 h-5 text-[var(--warning)] fill-[var(--warning)]" />
                     <span className="font-bold">{facility.rating}</span>
                     <span className="text-[var(--text-muted)] text-sm">({facility.reviews} reviews)</span>
                  </div>
                </div>

                {canReview && (
                  <Card variant="outlined" className="p-6 bg-[var(--bg-secondary)] border-[var(--accent-green)] border-opacity-50">
                    <h4 className="font-bold mb-4">Leave a Review</h4>
                    {reviewError && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
                        {reviewError}
                      </div>
                    )}
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Rating</label>
                        <div className="flex gap-2">
                           {[1,2,3,4,5].map(star => (
                             <button type="button" key={star} onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] rounded">
                               <Star className={`w-8 h-8 transition-colors ${reviewForm.rating >= star ? 'text-[var(--warning)] fill-[var(--warning)]' : 'text-[var(--text-muted)] opacity-50'}`} />
                             </button>
                           ))}
                        </div>
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1">Title</label>
                         <input type="text" className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] rounded-lg p-3 text-sm outline-none transition-colors" placeholder="Summarize your experience" value={reviewForm.title} onChange={e => setReviewForm(prev => ({...prev, title: e.target.value}))} required />
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1">Review</label>
                         <textarea className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] rounded-lg p-3 text-sm h-24 resize-none outline-none transition-colors" placeholder="What did you like or dislike?" value={reviewForm.body} onChange={e => setReviewForm(prev => ({...prev, body: e.target.value}))}></textarea>
                      </div>
                      <div className="flex items-center justify-between">
                         <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" className="w-4 h-4 rounded border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--accent-green)] focus:ring-[var(--accent-green)]" checked={reviewForm.isAnonymous} onChange={e => setReviewForm(prev => ({...prev, isAnonymous: e.target.checked}))} />
                           <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">Post anonymously</span>
                         </label>
                         <Button type="submit" variant="primary" disabled={isSubmittingReview}>
                           {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                         </Button>
                      </div>
                    </form>
                  </Card>
                )}

                <div className="space-y-4">
                   {reviews.length === 0 ? (
                     <div className="text-center py-10 text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)]">
                       <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-tertiary)] mb-3">
                         <Star className="w-5 h-5 opacity-50" />
                       </div>
                       <p className="font-medium text-[var(--text-secondary)]">No reviews yet.</p>
                       <p className="text-sm">Be the first to leave a review for this facility.</p>
                     </div>
                   ) : (
                     reviews.map(review => (
                       <Card key={review._id} variant="outlined" className="p-6 transition-all hover:border-[var(--border-hover)]">
                         <div className="flex justify-between items-start mb-3">
                           <div>
                             <div className="flex items-center gap-1 mb-2">
                               {[...Array(5)].map((_, i) => (
                                 <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-[var(--warning)] fill-[var(--warning)]' : 'text-[var(--text-muted)] opacity-30'}`} />
                               ))}
                             </div>
                             <h5 className="font-bold text-lg text-[var(--text-primary)]">{review.title}</h5>
                           </div>
                           <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded-md">
                             {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </span>
                         </div>
                         <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">{review.body}</p>
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)] text-xs font-bold border border-[var(--border-subtle)]">
                             {review.reviewerName.charAt(0).toUpperCase()}
                           </div>
                           <div className="text-xs font-medium text-[var(--text-secondary)]">
                             By <span className="text-[var(--text-primary)]">{review.reviewerName}</span>
                           </div>
                         </div>
                       </Card>
                     ))
                   )}
                </div>
              </div>
              </ErrorBoundary>
            </div>

            {/* Facility Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card variant="outlined" className="p-6">
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div>
                      <h1 className="text-3xl font-bold mb-1">{facility.name}</h1>
                      <p className="text-lg text-[var(--text-secondary)]">{facility.type}</p>
                    </div>
                    {isLoggedIn && (
                      <button
                        onClick={handleToggleFavorite}
                        className={`p-3 rounded-full border transition-all shrink-0 ${
                          isFavorite
                            ? 'border-[var(--accent-green)] text-[var(--accent-green)] bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)]'
                            : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-green)] hover:border-[var(--accent-green)]'
                        }`}
                        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-[var(--warning)] fill-[var(--warning)]" />
                    <span className="text-xl font-bold">{facility.rating}</span>
                    <span className="text-[var(--text-muted)]">({facility.reviews} reviews)</span>
                  </div>

                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {facility.description}
                  </p>
                </Card>

                <Card variant="outlined" className="p-6">
                  <h3 className="text-xl font-bold mb-4">Facility Details</h3>
                  <div className="grid grid-cols-2 gap-6">
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

                <Card variant="outlined" className="p-6">
                  <h3 className="text-xl font-bold mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {facility.amenities.map((amenity, idx) => (
                      <span key={idx} className={`text-sm px-3 py-1.5 rounded-[var(--radius-sm)] font-medium transition-colors ${getAmenityStyle(amenity)}`}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </Card>

                {schedule && schedule.length > 0 && (
                  <Card variant="outlined" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-[var(--accent-green)]" />
                      <h3 className="text-xl font-bold">Operating Hours</h3>
                    </div>
                    <div className="space-y-3">
                      {schedule.map((day, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] last:border-0 last:pb-0"
                        >
                          <span className="capitalize font-medium text-[var(--text-secondary)]">
                            {day.day_of_week}
                          </span>
                          <div className="text-right">
                            {day.is_maintenance ? (
                              <div className="flex flex-col items-end">
                                <Badge variant="warning">Maintenance</Badge>
                                {day.maintenance_note && (
                                  <span className="text-xs text-[var(--text-muted)] mt-1">
                                    {day.maintenance_note}
                                  </span>
                                )}
                              </div>
                            ) : day.is_closed ? (
                              <Badge variant="error" className="bg-red-500/10 text-red-500 border-red-500">
                                Closed
                              </Badge>
                            ) : (
                              <span className="font-semibold">
                                {day.open_time} - {day.close_time}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
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
