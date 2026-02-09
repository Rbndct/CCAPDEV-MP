import { ArrowRight, Calendar, Clock, MapPin, Trophy, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Input, Badge } from './ui';

// Navigation Bar Component
export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent-green)] rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[var(--bg-primary)]" />
            </div>
            <span className="text-xl font-bold text-gradient-green">SportsPlex</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors font-medium">
              Home
            </Link>
            <Link to="/facilities" className="text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors font-medium">
              Facilities
            </Link>
            <Link to="/about" className="text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Hero Section Component
export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-18">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[rgba(0,255,136,0.05)]"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 hero-orb-green rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 hero-orb-blue rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Book Your Court. <br />
          <span className="text-gradient-green">Play Your Game.</span>
        </h1>

        <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
          Premium sports facilities available 24/7. Reserve your spot in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
            Book Now
          </Button>
          <Button variant="outline" size="lg">
            View Facilities
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[var(--accent-green)]">12+</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">Facilities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[var(--accent-green)]">5K+</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[var(--accent-green)]">24/7</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Quick Availability Search Component
export const QuickSearch = () => {
  return (
    <section className="relative -mt-24 z-20 px-6">
      <Card variant="glass" hover="none" className="max-w-5xl mx-auto p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">Find Available Courts</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="date"
            label="Date"
          />

          <Input
            type="time"
            label="Time"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Facility Type
            </label>
            <select className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27%3e%3cpath fill=%27%236b6b6b%27 d=%27M6 8L0 0h12z%27/%3e%3c/svg%3e')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10">
              <option>🏀 Court A - Premium Basketball</option>
              <option>🏀 Court B - Standard Basketball</option>
              <option>🎾 Court C - Tennis Court 1</option>
              <option>🎾 Court D - Tennis Court 2</option>
              <option>🏸 Court E - Badminton Hall</option>
              <option>🏐 Court F - Volleyball Arena</option>
              <option>⚽ Court G - Multi-Purpose</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)] opacity-0">
              Search
            </label>
            <Button variant="primary" className="w-full !rounded-[var(--radius-md)]" icon={<ArrowRight className="w-5 h-5" />}>
              Search
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
};

// Facility Highlights Component
export const FacilityHighlights = () => {
  const facilities = [
    {
      name: 'Basketball Courts',
      description: 'Professional-grade indoor courts with premium flooring and lighting',
      icon: <Trophy className="w-8 h-8" />,
      image: 'basketball'
    },
    {
      name: 'Tennis Courts',
      description: 'Outdoor and indoor courts with high-quality surfaces',
      icon: <Zap className="w-8 h-8" />,
      image: 'tennis'
    },
    {
      name: 'Multi-Purpose Arena',
      description: 'Versatile space for badminton, volleyball, and more',
      icon: <Users className="w-8 h-8" />,
      image: 'arena'
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-gradient-green">Facilities</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            State-of-the-art sports facilities designed for peak performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <Card key={index} variant="elevated" hover="lift" className="group cursor-pointer">
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center border-b border-[var(--border-subtle)]">
                <div className="text-[var(--accent-green)] group-hover:scale-110 transition-transform">
                  {facility.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{facility.name}</h3>
                <p className="text-[var(--text-secondary)] text-sm mb-4">
                  {facility.description}
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-[var(--accent-green)] hover:gap-3 transition-all font-medium">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Announcements Component
export const Announcements = () => {
  const announcements = [
    {
      badge: 'New',
      icon: <Zap className="w-6 h-6" />,
      title: 'New Basketball Court Opening',
      description: 'State-of-the-art court with professional-grade flooring now available for booking!',
      variant: 'neon'
    },
    {
      badge: 'Promo',
      icon: <Trophy className="w-6 h-6" />,
      title: 'Weekend Special - 20% Off',
      description: 'Book any court for weekend sessions and get 20% off. Limited time offer!',
      variant: 'success'
    }
  ];

  return (
    <section className="py-24 px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Latest <span className="text-gradient-green">Updates</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)]">
            Stay informed about new facilities and special offers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {announcements.map((announcement, index) => (
            <Card key={index} variant="outlined" hover="glow" className="p-6 border-[var(--border-emphasis)] relative">
              <Badge variant={announcement.variant} className="absolute top-6 right-6">
                {announcement.badge}
              </Badge>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-[var(--accent-green)] flex-shrink-0" style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)' }}>
                  {announcement.icon}
                </div>
                <div className="flex-1 pr-20">
                  <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                </div>
              </div>

              <p className="text-[var(--text-secondary)] mb-4">
                {announcement.description}
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-[var(--accent-green)] hover:gap-3 transition-all font-medium">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--accent-green)] rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[var(--bg-primary)]" />
              </div>
              <span className="text-xl font-bold text-gradient-green">SportsPlex</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors text-sm">
                  Facilities
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-[var(--text-muted)]">
                <MapPin className="w-4 h-4 text-[var(--accent-green)] mt-0.5 flex-shrink-0" />
                <span>123 Sports Ave, City</span>
              </li>
              <li className="flex items-start gap-2 text-[var(--text-muted)]">
                <span className="text-[var(--accent-green)] flex-shrink-0">✉</span>
                <span>info@sportsplex.com</span>
              </li>
              <li className="flex items-start gap-2 text-[var(--text-muted)]">
                <span className="text-[var(--accent-green)] flex-shrink-0">☎</span>
                <span>(123) 456-7890</span>
              </li>
            </ul>
          </div>

          {/* Team */}
          <div>
            <h4 className="font-bold mb-4">Our Team</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>Aaron</li>
              <li>Cris</li>
              <li>Kirsten</li>
              <li>Rbee</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-8 text-center">
          <p className="text-[var(--text-muted)] text-sm">
            © 2026 SportsPlex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
