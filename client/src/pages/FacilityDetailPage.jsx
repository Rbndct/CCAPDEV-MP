import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star, Users, MapPin, Check, Zap, Trophy, Loader, Heart, Maximize, Layers, Image as ImageIcon, TriangleAlert } from 'lucide-react';
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

  // Map sport types to iconify URLs if not provided
  const getIconUrl = (type) => {
    switch (type) {
      case 'Basketball': return 'https://api.iconify.design/mdi/basketball.svg?color=%2300ff88';
      case 'Tennis': return 'https://api.iconify.design/mdi/tennis-ball.svg?color=%2300ff88';
      case 'Badminton': return 'https://api.iconify.design/mdi/badminton.svg?color=%2300ff88';
      case 'Volleyball': return 'https://api.iconify.design/mdi/volleyball.svg?color=%2300ff88';
      case 'Pickleball': return 'https://api.iconify.design/mdi/tennis.svg?color=%2300ff88';
      case 'Futsal': return 'https://api.iconify.design/mdi/soccer.svg?color=%2300ff88';
      case 'Table Tennis': return 'https://api.iconify.design/mdi/table-tennis.svg?color=%2300ff88';
      case 'Multi-Purpose': return 'https://api.iconify.design/mdi/soccer.svg?color=%2300ff88';
      default: return 'https://api.iconify.design/mdi/stadium.svg?color=%2300ff88';
    }
  };

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
              images: found.facility_images?.length ? found.facility_images : [],
              rating: 'New', // will be computed from real reviews
              reviews: 0,
              iconUrl: getIconUrl(found.facility_type),
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
    <div className="scroll-smooth">
      <Navbar />

      <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Maintenance / Unavailable Banner */}
          {facility.facility_status !== 'available' && (
            <div className={`mb-8 p-6 rounded-2xl border flex flex-col md:flex-row items-center gap-4 animate-pulse ${
              facility.facility_status === 'maintenance' 
                ? 'bg-orange-500/10 border-orange-500 text-orange-500' 
                : 'bg-red-500/10 border-red-500 text-red-500'
            }`}>
              <div className="p-3 rounded-full bg-current bg-opacity-10">
                <TriangleAlert className="w-8 h-8" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold mb-1">
                  Facility Currently {facility.facility_status === 'maintenance' ? 'Under Maintenance' : 'Unavailable'}
                </h2>
                <p className="opacity-80">
                  This facility is temporarily closed for bookings. We apologize for the inconvenience.
                </p>
              </div>
            </div>
          )}

          {/* Back Button */}
          <button
            onClick={() => navigate('/facilities')}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Facilities</span>
          </button>

          {/* 1. Hero Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{facility.name}</h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm md:text-base">
                <span className="flex items-center gap-1 font-semibold">
                  <Star className="w-5 h-5 text-[var(--warning)] fill-[var(--warning)]" />
                  {facility.rating} <span className="text-[var(--text-muted)] font-normal underline">({facility.reviews} reviews)</span>
                </span>
                <span className="text-[var(--text-muted)] hidden md:inline">•</span>
                <span className="flex items-center gap-1 text-[var(--text-secondary)] font-medium">
                  <MapPin className="w-4 h-4" />
                  {facility.location || 'Metro Manila, Philippines'}
                </span>
                <span className="text-[var(--text-muted)] hidden md:inline">•</span>
                <span className="text-[var(--text-secondary)] font-medium">{facility.type}</span>
              </div>
            </div>
            
            {/* Actions (Share/Save) */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(window.location.href);
                   alert('Link copied to clipboard!');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition-colors text-sm font-medium"
              >
                Share
              </button>
              {isLoggedIn && (
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                    isFavorite
                      ? 'border-[var(--accent-green)] text-[var(--accent-green)] bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)]'
                      : 'border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Bento Gallery */}
          {(() => {
            // Count includes facility icon + images array length. However, we always feature the icon prominently on the left.
            const imagesCount = facility.images.length;
            
            if (imagesCount === 0) {
              return (
                <div className="h-[40vh] min-h-[300px] w-full rounded-2xl overflow-hidden mb-8 relative group bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src={facility.iconUrl} alt="Facility icon" className="w-56 h-56 opacity-90 transition-transform duration-700 group-hover:scale-105" />
                  </div>
                </div>
              );
            }

            if (imagesCount === 1) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[45vh] min-h-[350px] mb-8 overflow-hidden rounded-2xl">
                  <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center h-full group relative cursor-pointer overflow-hidden border border-[var(--border-subtle)]">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10"></div>
                    <img src={facility.iconUrl} alt="Facility icon" className="w-48 h-48 opacity-90 transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="bg-[var(--bg-tertiary)] flex items-center justify-center h-full group relative cursor-pointer overflow-hidden border border-[var(--border-subtle)]">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10"></div>
                    {facility.images[0].startsWith('http') ? (
                       <img src={facility.images[0]} alt="Facility photo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0" />
                    ) : (
                       <ImageIcon className="w-16 h-16 text-[var(--text-muted)] opacity-30 transition-transform duration-700 group-hover:scale-105 z-0" />
                    )}
                  </div>
                </div>
              );
            }

            if (imagesCount === 2) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[50vh] min-h-[400px] mb-8 overflow-hidden rounded-2xl">
                  <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center h-full group relative cursor-pointer overflow-hidden border border-[var(--border-subtle)]">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10"></div>
                    <img src={facility.iconUrl} alt="Facility icon" className="w-56 h-56 opacity-90 transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="grid grid-rows-2 gap-2 h-full">
                    {[0, 1].map(idx => (
                      <div key={idx} className="bg-[var(--bg-tertiary)] flex items-center justify-center h-full group relative cursor-pointer overflow-hidden border border-[var(--border-subtle)]">
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10"></div>
                        {facility.images[idx]?.startsWith('http') ? (
                           <img src={facility.images[idx]} alt="Facility photo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0" />
                        ) : (
                           <ImageIcon className="w-12 h-12 text-[var(--text-muted)] opacity-30 transition-transform duration-700 group-hover:scale-105 z-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // 3+ images
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[50vh] min-h-[400px] mb-8 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-2">
                {/* Left Side: Hero */}
                <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center h-full rounded-xl group relative cursor-pointer overflow-hidden border border-[var(--border-subtle)] shadow-sm">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10"></div>
                  <img src={facility.iconUrl} alt="Facility icon" className="w-56 h-56 opacity-90 transition-transform duration-700 group-hover:scale-105" />
                </div>
                
                {/* Right Side: Dynamic Grid */}
                <div className="grid grid-cols-2 gap-2 h-full">
                   {facility.images.slice(0, 4).map((img, idx) => {
                     // If exactly 3 images, make the first one take full width of top row.
                     // The next two will perfectly fill the bottom 2 cells.
                     const isThreeImagesTopFull = imagesCount === 3 && idx === 0;
                     const hasMoreOverlay = imagesCount > 4 && idx === 3;
                     
                     return (
                       <div key={idx} className={`bg-[var(--bg-tertiary)] flex items-center justify-center h-full rounded-xl group relative cursor-pointer overflow-hidden border border-[var(--border-subtle)] shadow-sm ${isThreeImagesTopFull ? 'col-span-2' : ''}`}>
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
                         
                         {img.startsWith('http') ? (
                            <img src={img} alt="Facility photo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0" />
                         ) : (
                            <ImageIcon className="w-12 h-12 text-[var(--text-muted)] opacity-30 transition-transform duration-700 group-hover:scale-105 z-0" />
                         )}

                         {hasMoreOverlay && (
                           <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
                             <span className="text-white font-bold text-2xl tracking-tight">+{imagesCount - 4}</span>
                           </div>
                         )}
                       </div>
                     );
                   })}
                </div>
              </div>
            );
          })()}

          {/* 3. Quick-Jump Anchor Links (Glassmorphism & Fixed Layout) */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-[var(--border-subtle)] mb-8 pb-4 sticky top-[80px] z-40 bg-[var(--bg-primary)]/80 backdrop-blur-xl -mx-6 px-6 pt-4">
            <a href="#overview" className="whitespace-nowrap font-medium text-[var(--accent-green)] hover:text-[var(--accent-green)] border-b-2 border-[var(--accent-green)] pb-4 -mb-[17px]">Overview</a>
            <a href="#schedule" className="whitespace-nowrap font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors pb-4 -mb-[17px]">Schedule</a>
            <a href="#location" className="whitespace-nowrap font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors pb-4 -mb-[17px]">Location</a>
            <a href="#reviews" className="whitespace-nowrap font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors pb-4 -mb-[17px]">Reviews</a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12" id="overview">
            {/* Main Content (Left, 2 columns wide) */}
            <div className="lg:col-span-2 space-y-10">   
               {/* Description & Base Stats */}
               <div className="space-y-6 pb-8 border-b border-[var(--border-subtle)]">
                 <h2 className="text-2xl font-bold">About this Facility</h2>
                 <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                   {facility.description}
                 </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                    <div className="flex flex-col items-center text-center p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--accent-green)] transition-colors group">
                      <Users className="w-8 h-8 text-[var(--accent-green)] mb-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" strokeWidth={1.5} />
                      <div className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-bold mb-1">Capacity</div>
                      <div className="text-lg font-bold text-[var(--text-primary)]">{facility.capacity}</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--accent-green)] transition-colors group">
                      <Maximize className="w-8 h-8 text-[var(--accent-green)] mb-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" strokeWidth={1.5} />
                      <div className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-bold mb-1">Court Size</div>
                      <div className="text-lg font-bold text-[var(--text-primary)]">{facility.size}</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--accent-green)] transition-colors group">
                      <Layers className="w-8 h-8 text-[var(--accent-green)] mb-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" strokeWidth={1.5} />
                      <div className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-bold mb-1">Surface</div>
                      <div className="text-lg font-bold text-[var(--text-primary)]">{facility.surface}</div>
                    </div>
                  </div>
               </div>
               
               {/* Amenities List */}
               <div className="pb-8 border-b border-[var(--border-subtle)]">
                 <h2 className="text-2xl font-bold mb-6">What this place offers</h2>
                 <div className="flex flex-wrap gap-2">
                    {facility.amenities.map((amenity, idx) => (
                       <span key={idx} className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${getAmenityStyle(amenity)} flex items-center gap-2`}>
                          <Check className="w-4 h-4" />
                          {amenity}
                       </span>
                    ))}
                 </div>
               </div>

               {/* Collapsible Calendar Here */}
               <div id="schedule" className="pt-8 scroll-mt-28">
                 <h2 className="text-2xl font-bold mb-6">Bookings & Availability</h2>
                 <ErrorBoundary name="PublicAvailabilityCalendar">
                    <PublicAvailabilityCalendar
                      facility={facility}
                      onSlotSelect={handleSlotSelect}
                      isBooking={isBooking}
                      refreshKey={availabilityRefreshKey}
                    />
                 </ErrorBoundary>
               </div>

               {/* Location */}
               <div id="location" className="pt-8 scroll-mt-28 border-t border-[var(--border-subtle)] mt-10">
                 <h2 className="text-2xl font-bold mb-6">Where you'll go</h2>
                 <ErrorBoundary name="LocationSection">
                   <LocationSection facility={facility} />
                 </ErrorBoundary>
               </div>

               {/* Reviews Header & List */}
               <div id="reviews" className="pt-8 scroll-mt-28 border-t border-[var(--border-subtle)] mt-10">
                 <ErrorBoundary name="ReviewsSection">
                 <div className="space-y-6">
                   <div className="flex items-center gap-4 border-b border-[var(--border-subtle)] pb-6 mb-6">
                     <Star className="w-8 h-8 text-[var(--warning)] fill-[var(--warning)]" />
                     <h3 className="text-3xl font-bold">{facility.rating}</h3>
                     <span className="text-xl font-medium text-[var(--text-muted)]">· {facility.reviews} reviews</span>
                   </div>

                   {canReview && (
                     <Card variant="outlined" className="p-6 mb-8 bg-[rgba(0,255,136,0.02)] border-[var(--accent-green)] border-opacity-30">
                       <h4 className="font-bold mb-4 text-lg">Leave a Review</h4>
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
                                <button type="button" key={star} onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] rounded transition-transform hover:scale-110">
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
                         <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input type="checkbox" className="w-4 h-4 rounded border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--accent-green)] focus:ring-[var(--accent-green)]" checked={reviewForm.isAnonymous} onChange={e => setReviewForm(prev => ({...prev, isAnonymous: e.target.checked}))} />
                              <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">Post anonymously</span>
                            </label>
                            <Button type="submit" variant="primary" className="px-6" disabled={isSubmittingReview}>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {reviews.map(review => (
                            <Card key={review._id} variant="outlined" className="p-6 transition-all hover:border-[var(--border-hover)]">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-[var(--warning)] fill-[var(--warning)]' : 'text-[var(--text-muted)] opacity-30'}`} />
                                    ))}
                                  </div>
                                  <h5 className="font-bold text-[var(--text-primary)]">{review.title}</h5>
                                </div>
                              </div>
                              <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">{review.body}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)] text-xs font-bold border border-[var(--border-subtle)]">
                                    {review.reviewerName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="text-xs font-medium text-[var(--text-secondary)]">
                                    {review.reviewerName}
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-[var(--text-muted)]">
                                  {new Date(review.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                   </div>
                 </div>
                 </ErrorBoundary>
               </div>
            </div>
            
            {/* STICKY RIGHT SIDEBAR - 2. CTA Conversion Sidebar */}
            <div className="lg:col-span-1 hidden lg:block">
               <div className="sticky top-40 scroll-mt-40">
                 <Card variant="elevated" className="p-6 border border-[var(--border-subtle)] shadow-2xl">
                    <div className="flex items-end gap-1 mb-6">
                       <span className="text-3xl font-bold font-mono">₱{facility.price}</span>
                       <span className="text-[var(--text-muted)] font-medium mb-1">/ hour</span>
                    </div>

                    <a href={facility.facility_status === 'available' ? "#schedule" : "#overview"} className="block w-full text-center">
                      <Button 
                        variant={facility.facility_status === 'available' ? "primary" : "outline"} 
                        className={`w-full !rounded-xl py-6 text-lg font-bold shadow-lg transition-all transform ${
                          facility.facility_status === 'available' 
                            ? 'shadow-[rgba(0,255,136,0.2)] hover:shadow-[rgba(0,255,136,0.4)] hover:-translate-y-0.5' 
                            : 'opacity-50 cursor-not-allowed'
                        }`} 
                        icon={facility.facility_status === 'available' ? <Calendar className="w-5 h-5"/> : <TriangleAlert className="w-5 h-5"/>}
                        disabled={facility.facility_status !== 'available'}
                      >
                        {facility.facility_status === 'available' ? 'Check Availability' : (facility.facility_status === 'maintenance' ? 'Under Maintenance' : 'Unavailable')}
                      </Button>
                    </a>
                    <div className="text-center text-sm text-[var(--text-muted)] mt-4 mb-6">You won't be charged yet</div>

                    {/* Operating Hours Summary */}
                    {schedule && schedule.length > 0 && (
                      <div className="pt-6 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-sm text-[var(--text-muted)] uppercase tracking-wider">Operating Hours</h4>
                          <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                        <div className="space-y-3 text-sm">
                          {schedule.map((day, idx) => (
                            <div key={idx} className="flex justify-between items-center group">
                              <span className="capitalize text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)] transition-colors">{day.day_of_week}</span>
                              <span className="font-semibold text-[var(--text-primary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded">
                                {day.is_closed ? <span className="text-red-500">Closed</span> : 
                                 day.is_maintenance ? <span className="text-yellow-500">Maintenance</span> : 
                                 `${day.open_time} - ${day.close_time}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                 </Card>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] z-50 flex items-center justify-between safe-area-pb">
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold">₱{facility.price}</span>
          <span className="text-[var(--text-muted)] text-sm mb-1">/ hr</span>
        </div>
        <a href={facility.facility_status === 'available' ? "#schedule" : "#overview"}>
          <Button 
            variant={facility.facility_status === 'available' ? "primary" : "outline"} 
            className={`px-8 font-bold ${facility.facility_status === 'available' ? 'shadow-[rgba(0,255,136,0.2)]' : 'opacity-50'}`}
            disabled={facility.facility_status !== 'available'}
          >
            {facility.facility_status === 'available' ? 'Book' : 'Unavailable'}
          </Button>
        </a>
      </div>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        returnTo={`/facilities/${facilityId}`}
      />
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        booking={bookingData}
      />
    </div>
  );
};
