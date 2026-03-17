import { useState, useEffect } from 'react';
import { Card, Button } from '../components/ui';
import { Star, ArrowRight, Calendar, Heart, Trophy, Activity, Dumbbell, MapPin, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../contexts/AuthContext';

export const FavoritesPage = () => {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL || 'http://localhost:5000/api'}/profiles/me/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchFavorites();
  }, [token]);

  const removeFavorite = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL || 'http://localhost:5000/api'}/profiles/me/favorites/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setFavorites(prev => prev.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  if (isLoading) {
      return <div className="p-12 text-center text-[var(--text-secondary)]">Loading favorites...</div>
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-[var(--text-secondary)]">Your go-to courts for quick access.</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((facility) => (
            <Card key={facility._id} variant="glass" className="p-6 relative group hover:border-[var(--accent-green)] transition-all">
              <button 
                onClick={() => removeFavorite(facility._id)}
                className="absolute top-4 right-4 text-[var(--accent-green)] hover:text-red-500 transition-colors z-10"
                title="Remove from favorites"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                   {facility.images && facility.images[0] ? (
                       <img src={facility.images[0]} alt={facility.facility_name} className="w-full h-full object-cover" />
                   ) : (
                       <Trophy className="w-8 h-8 text-[var(--accent-green)]" />
                   )}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight truncate">{facility.facility_name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{facility.facility_type}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{facility.location}</span>
                 </div>
              </div>

              <div className="flex items-center gap-4 mb-6 text-sm text-[var(--text-muted)]">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[var(--warning)] fill-current" />
                  <span className="font-medium text-[var(--text-primary)]">4.5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[var(--accent-green)]">₱{facility.hourly_rate_php}</span>
                  <span>/ hour</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link to={`/facilities/${facility._id}`} className="block">
                    <Button variant="outline" className="w-full text-xs">
                        View Details
                    </Button>
                </Link>
                <Link to={`/facilities/${facility._id}?action=book`} className="block">
                    <Button variant="primary" className="w-full text-xs" icon={<Calendar className="w-3 h-3" />}>
                        Book Now
                    </Button>
                </Link>
              </div>
            </Card>
          ))}
          
          {/* Add New Favorite Placeholder */}
          <Link to="/facilities">
            <div className="h-full min-h-[240px] border-2 border-dashed border-[var(--border-subtle)] rounded-[var(--radius-lg)] flex flex-col items-center justify-center p-6 text-[var(--text-muted)] hover:text-[var(--accent-green)] hover:border-[var(--accent-green)] hover:bg-[rgba(0,255,136,0.05)] transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-3">
                    <ArrowRight className="w-6 h-6" />
                </div>
                <span className="font-medium">Browse Facilities</span>
                <span className="text-xs mt-1 opacity-70">Add more favorites</span>
            </div>
          </Link>
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--bg-tertiary)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)]">
            <div className="w-20 h-20 mx-auto mb-4 bg-[var(--bg-primary)] rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Favorites Yet</h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-xs mx-auto">
                Save your favorite courts for quicker booking access.
            </p>
            <Link to="/facilities">
                <Button variant="primary">Explore Facilities</Button>
            </Link>
        </div>
      )}
    </div>
  );
};
