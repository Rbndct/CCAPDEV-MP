import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Star, Users, MapPin, Zap, ArrowRight, Filter, CheckCircle, AlertTriangle, Info, ChevronDown, X, Check, Dribbble, Trophy, Wind, Activity, Heart } from 'lucide-react';
import { Card, Button, Badge } from './ui';
import { AvailabilityCalendar } from './AvailabilityCalendar';

import { useAuth, API_BASE_URL } from '../contexts/AuthContext';

// Hardcoded comprehensive list of amenities for filtering since DB might not have all variations initially
const allAmenities = [
  'Air Conditioned', 'Air Conditioning', 'Ball Machine', 'Ball Rental', 'Bleachers', 
  'Convertible', 'Equipment Rental', 'Flexible Setup', 'Floodlights', 'Free Parking', 
  'Good Lighting', 'Hard Court', 'High Ceiling', 'Locker Room', 'Locker Rooms', 
  'Multiple Sports', 'Paddle Rental', 'Parking', 'Premium Surface', 'Professional Court', 
  'Professional Grade', 'Professional Net', 'Quality Nets', 'Sand Option', 'Scoreboard', 
  'Scoreboards', 'Shower', 'Showers', 'Spectator Seating', 'Standard Equipment', 
  'Tournament Grade', 'Water Fountains', '4 Courts'
].sort();

// Helper: Get color style for amenities
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

// Custom Multi-Select Dropdown for Amenities
const AmenityMultiSelect = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (option, e) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full min-h-[50px] bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-primary)] cursor-pointer flex items-center justify-between hover:border-[var(--accent-green)] transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1.5 max-w-[90%]">
          {selected.length === 0 ? (
            <span className="text-[var(--text-muted)] py-1">Select amenities...</span>
          ) : (
            selected.map(item => (
              <span
                key={item}
                className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${getAmenityStyle(item)}`}
                onClick={(e) => e.stopPropagation()}
              >
                {item}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-[var(--error)]"
                  onClick={(e) => removeOption(item, e)}
                />
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] shadow-xl max-h-60 overflow-y-auto p-2">
          {options.map(option => (
            <div
              key={option}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${selected.includes(option) ? 'bg-[var(--bg-tertiary)]' : 'hover:bg-[var(--bg-tertiary)]'}`}
              onClick={() => toggleOption(option)}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected.includes(option) ? 'bg-[var(--accent-green)] border-[var(--accent-green)]' : 'border-[var(--text-muted)]'}`}>
                {selected.includes(option) && <Check className="w-3 h-3 text-black" />}
              </div>
              <span className={`text-sm px-2 py-1 rounded ${getAmenityStyle(option)} bg-transparent border-0`}>
                {option}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Sport Select with Icons
const SportSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sports = [
    { id: 'all', label: 'All Sports', icon: Activity },
    { id: 'Basketball', label: 'Basketball', icon: Dribbble },
    { id: 'Tennis', label: 'Tennis', icon: Trophy },
    { id: 'Badminton', label: 'Badminton', icon: Wind },
    { id: 'Volleyball', label: 'Volleyball', icon: Activity },
    { id: 'Pickleball', label: 'Pickleball', icon: Activity },
    { id: 'Futsal', label: 'Futsal', icon: Activity },
    { id: 'Table Tennis', label: 'Table Tennis', icon: Activity },
    { id: 'Multi-Purpose', label: 'Multi-Purpose', icon: Activity },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedSport = sports.find(s => s.id === value) || sports[0];
  const SelectedIcon = selectedSport.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] cursor-pointer flex items-center justify-between hover:border-[var(--accent-green)] transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <SelectedIcon className="w-4 h-4 text-[var(--accent-green)]" />
          <span>{selectedSport.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] shadow-xl max-h-60 overflow-y-auto">
          {sports.map((sport) => {
            const Icon = sport.icon;
            return (
              <div
                key={sport.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${value === sport.id ? 'bg-[var(--accent-green)] text-black' : 'hover:bg-[var(--bg-tertiary)]'}`}
                onClick={() => {
                  onChange(sport.id);
                  setIsOpen(false);
                }}
              >
                <Icon className={`w-4 h-4 ${value === sport.id ? 'text-black' : 'text-[var(--accent-green)]'}`} />
                <span>{sport.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Filter Section Component
const FilterSection = ({ filters, setFilters, onApplyFilters, amenities }) => {
  return (
    <Card variant="glass" className="p-6 mb-8 !overflow-visible">
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-5 h-5 text-[var(--accent-green)]" />
        <h3 className="text-xl font-bold">Filter Facilities</h3>
      </div>

      {/* First Row - Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        {/* Sport Type Filter - ENHANCED */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Sport Type
          </label>
          <SportSelect
            value={filters.sportType}
            onChange={(value) => setFilters({ ...filters, sportType: value })}
          />
        </div>

        {/* Amenity Filter - ENHANCED */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Amenities
          </label>
          <AmenityMultiSelect
            options={amenities}
            selected={filters.amenities}
            onChange={(newAmenities) => setFilters({ ...filters, amenities: newAmenities })}
          />
        </div>

        {/* Date Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Date
          </label>
          <input
            type="date"
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] transition-all"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>

        {/* Price Range Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Max Price (₱/hour)
          </label>
          <select
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] transition-all"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          >
            <option value="9999">Any Price</option>
            <option value="300">Up to ₱300</option>
            <option value="500">Up to ₱500</option>
            <option value="600">Up to ₱600</option>
            <option value="700">Up to ₱700</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Min Rating
          </label>
          <select
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] transition-all"
            value={filters.minRating}
            onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
          >
            <option value="0">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>
      </div>

      {/* Second Row - Apply Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          className="!rounded-[var(--radius-md)] px-8"
          onClick={onApplyFilters}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};

// Facility Card Component (unchanged logic, just re-declaring to keep file context valid if needed, 
// but since I'm targeting lines 1-361 I should ensure I don't break the file structure.
// I pasted the start of the file heavily modified. 

// The replace block covers up to line 361.
// I need to ensure `FacilitiesPage` component logic is updated too.

// Facility Card Component
const FacilityCard = ({ facility, onViewSchedule, isFavorite, onToggleFavorite, isLoggedIn }) => {
  if (!facility) return null; // Safeguard if facility is undefined

  const availabilityConfig = {
    high: {
      text: 'High Availability',
      color: 'success',
      icon: CheckCircle
    },
    medium: {
      text: 'Limited Slots',
      color: 'warning',
      icon: AlertTriangle
    },
    low: {
      text: 'Few Slots Left',
      color: 'error',
      icon: Clock
    },
    maintenance: {
      text: 'Under Maintenance',
      color: 'warning',
      icon: AlertTriangle
    },
    closed: {
      text: 'Unavailable',
      color: 'error',
      icon: X
    }
  };

  const statusKey = (facility.facility_status === 'maintenance' || facility.facility_status === 'closed') 
    ? facility.facility_status 
    : 'high';
  const status = availabilityConfig[statusKey];
  const StatusIcon = status.icon;

  // Map sport types to iconify URLs if not provided
  const getIconForType = (type) => {
    switch (type) {
      case 'Basketball': return 'https://api.iconify.design/mdi/basketball.svg?color=%2300ff88';
      case 'Tennis': return 'https://api.iconify.design/mdi/tennis-ball.svg?color=%2300ff88';
      case 'Badminton': return 'https://api.iconify.design/mdi/badminton.svg?color=%2300ff88';
      case 'Volleyball': return 'https://api.iconify.design/mdi/volleyball.svg?color=%2300ff88';
      case 'Pickleball': return 'https://api.iconify.design/mdi/tennis.svg?color=%2300ff88';
      case 'Futsal': return 'https://api.iconify.design/mdi/soccer.svg?color=%2300ff88';
      case 'Table Tennis': return 'https://api.iconify.design/mdi/table-tennis.svg?color=%2300ff88';
      case 'Multi-Purpose': return 'https://api.iconify.design/mdi/soccer.svg?color=%2300ff88';
      default: return 'https://api.iconify.design/mdi/calendar.svg?color=%2300ff88';
    }
  };

  const iconUrl = facility?.icon || getIconForType(facility?.type);

  return (
    <Card variant="elevated" hover="lift" className="overflow-hidden h-full flex flex-col">
      {/* Icon Header */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center">
        <img src={iconUrl} alt={facility?.type || 'Sport'} className="w-32 h-32" />
        <Badge
          variant={status.color}
          className="absolute top-4 right-4 flex items-center gap-1.5 shadow-lg backdrop-blur-md"
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {status.text}
        </Badge>
        {isLoggedIn && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(facility?._id || facility?.id); }}
            className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-md transition-all shadow-lg ${isFavorite ? 'bg-[var(--accent-green)] text-black' : 'bg-black/50 text-white hover:bg-black/70 hover:text-[var(--accent-green)]'
              }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold mb-1">{facility?.name || facility?.facility_name || 'Court'}</h3>
            <p className="text-sm text-[var(--text-muted)]">{facility?.type || facility?.facility_type || 'Facility'}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[var(--warning)] fill-[var(--warning)]" />
              <span className="font-bold">{facility?.rating || 'New'}</span>
            </div>
            {(facility?.reviews > 0) && (
               <span className="text-[11px] text-[var(--text-muted)]">{facility.reviews} reviews</span>
            )}
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
          {facility?.description || facility?.facility_description || ''}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 text-[var(--accent-green)] font-bold text-sm flex items-center justify-center">₱</span>
            <span className="text-[var(--text-secondary)]">₱{facility?.hourly_rate || facility?.hourly_rate_php || facility?.price || 500}/hour</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-[var(--accent-green)]" />
            <span className="text-[var(--text-secondary)]">Up to {facility?.capacity || facility?.total_capacity || 0}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(facility?.amenities || facility?.facility_amenities || []).slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className={`text-xs px-2.5 py-1 rounded-[var(--radius-sm)] font-medium transition-colors ${getAmenityStyle(amenity)}`}
            >
              {amenity}
            </span>
          ))}
          {(facility?.amenities || facility?.facility_amenities || []).length > 3 && (
            <span className="text-xs px-2.5 py-1 bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
              +{(facility?.amenities || facility?.facility_amenities || []).length - 3}
            </span>
          )}
        </div>

        {/* Action Button */}
        <Link to={`/facilities/${facility?._id || facility?.id}`} className="block">
          <Button
            variant="outline"
            className="w-full !rounded-[var(--radius-md)] group-hover:bg-[var(--accent-green)] group-hover:text-[var(--bg-primary)] group-hover:border-[var(--accent-green)] transition-all"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

// Main Facilities Page Component
export const FacilitiesPage = () => {
  const { token, isLoggedIn } = useAuth();
  const [favoritesList, setFavoritesList] = useState([]);
  const [filters, setFilters] = useState({
    sportType: 'all',
    amenities: [],
    date: '',
    time: '',
    maxPrice: '9999',
    minRating: '0'
  });

  const [facilitiesData, setFacilitiesData] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/reservations/facilities`);
        const data = await response.json();
        if (response.ok) {
          // Normalize MongoDB field names to what FacilityCard expects
          const normalized = data.map(f => ({
            ...f,
            name: f.facility_name,
            type: f.facility_type,
            description: f.facility_description,
            capacity: f.total_capacity,
            hourly_rate: f.hourly_rate_php,
            amenities: f.facility_amenities || [],
            facility_status: f.facility_status || 'available',
          }));
          setFacilitiesData(normalized);
          setFilteredFacilities(normalized);
        }
      } catch (err) {
        console.error("Failed to fetch facilities:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/profiles/me/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // data should be populated facilities, map to their IDs
          setFavoritesList(data.map(f => f._id || f));
        }
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };

    fetchFacilities();
    if (isLoggedIn && token) fetchFavorites();
  }, [isLoggedIn, token]);

  const applyFilters = () => {
    let filtered = facilitiesData;

    // Filter by sport type
    if (filters.sportType !== 'all') {
      filtered = filtered.filter(f => f.type === filters.sportType);
    }

    // Filter by amenities (AND logic)
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(f =>
        filters.amenities.every(selectedAmenity => (f.amenities || []).includes(selectedAmenity))
      );
    }

    // Filter by price
    filtered = filtered.filter(f => (f.hourly_rate || f.price || 500) <= parseInt(filters.maxPrice));

    // Filter by minimum rating
    if (filters.minRating !== '0') {
      const min = parseInt(filters.minRating);
      filtered = filtered.filter(f => typeof f.rating === 'number' && f.rating >= min);
    }

    setFilteredFacilities(filtered);
  };

  const handleToggleFavorite = async (facilityId) => {
    try {
      const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/profiles/me/favorites/${facilityId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        if (favoritesList.includes(facilityId)) {
          setFavoritesList(prev => prev.filter(id => id !== facilityId));
        } else {
          setFavoritesList(prev => [...prev, facilityId]);
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  const handleViewSchedule = (facility) => {
    setSelectedFacility(facility);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Browse <span className="text-gradient-green">Facilities</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Find the perfect court for your next game
          </p>
        </div>

        {/* Filters */}
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={applyFilters}
          amenities={allAmenities}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[var(--text-secondary)]">
            Showing <span className="text-[var(--accent-green)] font-bold">{filteredFacilities.length}</span> facilities
          </p>
        </div>

        {/* Facility Cards Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-2xl text-[var(--text-muted)] mb-4">Loading facilities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFacilities.map((facility) => (
              <FacilityCard
                key={facility._id || facility.id}
                facility={facility}
                onViewSchedule={handleViewSchedule}
                isLoggedIn={isLoggedIn}
                isFavorite={favoritesList.includes(facility._id || facility.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredFacilities.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-[var(--text-muted)] mb-4">No facilities found</p>
            <p className="text-[var(--text-secondary)]">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Availability Calendar Modal */}
      {selectedFacility && (
        <AvailabilityCalendar
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
        />
      )}
    </div>
  );
};


