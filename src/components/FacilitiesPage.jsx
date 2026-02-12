import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Star, Users, MapPin, Zap, ArrowRight, Filter } from 'lucide-react';
import { Card, Button, Badge } from './ui';
import { AvailabilityCalendar } from './AvailabilityCalendar';

// Facilities data
const facilitiesData = [
  {
    id: 1,
    name: 'Court A - Premium Basketball',
    type: 'Basketball',
    icon: 'https://api.iconify.design/mdi/basketball.svg?color=%2300ff88',
    price: 600,
    rating: 4.9,
    capacity: 10,
    amenities: ['Air Conditioned', 'Professional Grade', 'Scoreboard'],
    description: 'Premium indoor basketball court with professional-grade wooden flooring and equipment.',
    availability: 'high'
  },
  {
    id: 2,
    name: 'Court B - Standard Basketball',
    type: 'Basketball',
    icon: 'https://api.iconify.design/mdi/basketball.svg?color=%2300ff88',
    price: 500,
    rating: 4.5,
    capacity: 10,
    amenities: ['Good Lighting', 'Standard Equipment'],
    description: 'Standard indoor basketball court perfect for casual games and practice.',
    availability: 'medium'
  },
  {
    id: 3,
    name: 'Court C - Tennis Court 1',
    type: 'Tennis',
    icon: 'https://api.iconify.design/mdi/tennis-ball.svg?color=%2300ff88',
    price: 500,
    rating: 4.8,
    capacity: 4,
    amenities: ['Hard Court', 'Professional Net', 'Ball Machine'],
    description: 'Indoor hard surface tennis court with professional-grade equipment.',
    availability: 'high'
  },
  {
    id: 4,
    name: 'Court D - Tennis Court 2',
    type: 'Tennis',
    icon: 'https://api.iconify.design/mdi/tennis-ball.svg?color=%2300ff88',
    price: 500,
    rating: 4.9,
    capacity: 4,
    amenities: ['Tournament Grade', 'Spectator Seating', 'Premium Surface'],
    description: 'Tournament-grade tennis court suitable for competitive matches.',
    availability: 'low'
  },
  {
    id: 5,
    name: 'Court E - Badminton Hall',
    type: 'Badminton',
    icon: 'https://api.iconify.design/mdi/badminton.svg?color=%2300ff88',
    price: 500,
    rating: 4.7,
    capacity: 16,
    amenities: ['4 Courts', 'High Ceiling', 'Quality Nets'],
    description: 'Multi-court badminton facility with 4 courts and excellent lighting.',
    availability: 'high'
  },
  {
    id: 6,
    name: 'Court F - Volleyball Arena',
    type: 'Volleyball',
    icon: 'https://api.iconify.design/mdi/volleyball.svg?color=%2300ff88',
    price: 500,
    rating: 4.8,
    capacity: 12,
    amenities: ['Professional Court', 'Sand Option', 'Scoreboards'],
    description: 'Professional indoor volleyball court with regulation net and flooring.',
    availability: 'medium'
  },
  {
    id: 7,
    name: 'Court G - Multi-Purpose',
    type: 'Multi-Purpose',
    icon: 'https://api.iconify.design/mdi/soccer.svg?color=%2300ff88',
    price: 500,
    rating: 4.6,
    capacity: 20,
    amenities: ['Convertible', 'Multiple Sports', 'Flexible Setup'],
    description: 'Versatile court suitable for basketball, badminton, volleyball, and futsal.',
    availability: 'high'
  },
  {
    id: 8,
    name: 'Court H - Pickleball Arena',
    type: 'Pickleball',
    icon: 'https://api.iconify.design/mdi/tennis.svg?color=%2300ff88',
    price: 500,
    rating: 4.9,
    capacity: 8,
    amenities: ['Professional Court', 'Paddle Rental', 'Good Lighting'],
    description: 'Dedicated pickleball court with professional surface and equipment.',
    availability: 'high'
  }
];

// Filter Section Component
const FilterSection = ({ filters, setFilters, onApplyFilters }) => {
  return (
    <Card variant="glass" className="p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-5 h-5 text-[var(--accent-green)]" />
        <h3 className="text-xl font-bold">Filter Facilities</h3>
      </div>

      {/* First Row - Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Sport Type Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Sport Type
          </label>
          <select
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] transition-all"
            value={filters.sportType}
            onChange={(e) => setFilters({ ...filters, sportType: e.target.value })}
          >
            <option value="all">All Sports</option>
            <option value="Basketball">🏀 Basketball</option>
            <option value="Tennis">🎾 Tennis</option>
            <option value="Badminton">🏸 Badminton</option>
            <option value="Volleyball">🏐 Volleyball</option>
            <option value="Pickleball">🏓 Pickleball</option>
            <option value="Multi-Purpose">⚽ Multi-Purpose</option>
          </select>
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

        {/* Time Filter - NEW */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Time
          </label>
          <input
            type="time"
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] transition-all"
            value={filters.time}
            onChange={(e) => setFilters({ ...filters, time: e.target.value })}
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
            <option value="999">Any Price</option>
            <option value="500">Up to ₱500</option>
            <option value="600">Up to ₱600</option>
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

// Facility Card Component
const FacilityCard = ({ facility, onViewSchedule }) => {
  const availabilityColors = {
    high: 'success',
    medium: 'warning',
    low: 'error'
  };

  const availabilityText = {
    high: 'High Availability',
    medium: 'Limited Slots',
    low: 'Few Slots Left'
  };

  return (
    <Card variant="elevated" hover="lift" className="overflow-hidden">
      {/* Icon Header */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center">
        <img src={facility.icon} alt={facility.type} className="w-32 h-32" />
        <Badge
          variant={availabilityColors[facility.availability]}
          className="absolute top-4 right-4"
        >
          {availabilityText[facility.availability]}
        </Badge>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold mb-1">{facility.name}</h3>
            <p className="text-sm text-[var(--text-muted)]">{facility.type}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-[var(--warning)] fill-[var(--warning)]" />
            <span className="font-bold">{facility.rating}</span>
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {facility.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 text-[var(--accent-green)] font-bold text-sm flex items-center justify-center">₱</span>
            <span className="text-[var(--text-secondary)]">₱{facility.price}/hour</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-[var(--accent-green)]" />
            <span className="text-[var(--text-secondary)]">Up to {facility.capacity}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {facility.amenities.slice(0, 2).map((amenity, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] text-[var(--text-primary)]"
            >
              {amenity}
            </span>
          ))}
          {facility.amenities.length > 2 && (
            <span className="text-xs px-2 py-1 bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] text-[var(--text-primary)]">
              +{facility.amenities.length - 2} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <Link to={`/facilities/${facility.id}`} className="block">
          <Button
            variant="outline"
            className="w-full !rounded-[var(--radius-md)]"
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
  const [filters, setFilters] = useState({
    sportType: 'all',
    date: '',
    time: '',
    maxPrice: '999'
  });

  const [filteredFacilities, setFilteredFacilities] = useState(facilitiesData);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const applyFilters = () => {
    let filtered = facilitiesData;

    // Filter by sport type
    if (filters.sportType !== 'all') {
      filtered = filtered.filter(f => f.type === filters.sportType);
    }

    // Filter by price
    filtered = filtered.filter(f => f.price <= parseInt(filters.maxPrice));

    setFilteredFacilities(filtered);
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
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[var(--text-secondary)]">
            Showing <span className="text-[var(--accent-green)] font-bold">{filteredFacilities.length}</span> facilities
          </p>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFacilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onViewSchedule={handleViewSchedule}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredFacilities.length === 0 && (
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
