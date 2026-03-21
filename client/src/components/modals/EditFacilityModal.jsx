import { useState, useEffect, useRef } from 'react';
import { Modal } from '../Modal';
import { Button, Input, Select } from '../ui';
import { useAuth, API_BASE_URL } from '../../contexts/AuthContext';
import { Upload, X, Image as ImageIcon, Info, MapPin } from 'lucide-react';

export const EditFacilityModal = ({ isOpen, onClose, facility, onRefresh }) => {
    const { token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        hourlyRate: '',
        capacity: '',
        description: '',
        status: 'available',
        location: '',
        surface: '',
        size: '',
    });

    // Image & Amenities State
    const [images, setImages] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [newAmenity, setNewAmenity] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    
    const fileInputRef = useRef(null);

    // Populate essential form data instantly, then fetch the full details
    useEffect(() => {
        if (facility && isOpen) {
            // Instantly fill known summary fields from the row to prevent UI flicker
            setFormData(prev => ({
                ...prev,
                name: facility.name || '',
                type: facility.type || '',
                hourlyRate: facility.rate?.replace('₱', '').replace('/hr', '') || '',
                capacity: facility.capacity || '',
                status: facility.status || 'available'
            }));
            
            // Fetch heavy details (Images, Amenities, Description, exact Location)
            fetchFacilityDetails(facility.id);
        }
    }, [facility, isOpen]);

    // We need to fetch the FULL facility object because the table only passes a minimal mapped version
    const fetchFacilityDetails = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/reservations/facilities/${id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.facility_name || '',
                    type: data.facility_type || '',
                    hourlyRate: data.hourly_rate_php || '',
                    capacity: data.total_capacity || '',
                    description: data.facility_description || '',
                    status: data.facility_status || 'available',
                    location: data.facility_location || '',
                    surface: data.facility_surface || '',
                    size: data.facility_size || '',
                });
                setImages(data.facility_images || []);
                setAmenities(data.facility_amenities || []);
            }
        } catch (error) {
            console.error("Failed to fetch full details:", error);
        }
    };

    const facilityTypes = [
        { value: '', label: 'Select facility type' },
        { value: 'Basketball', label: 'Basketball' },
        { value: 'Tennis', label: 'Tennis' },
        { value: 'Badminton', label: 'Badminton' },
        { value: 'Volleyball', label: 'Volleyball' },
        { value: 'Swimming', label: 'Swimming Pool' },
        { value: 'Gym', label: 'Gym/Fitness' },
        { value: 'Futsal', label: 'Futsal' },
        { value: 'Table Tennis', label: 'Table Tennis' },
        { value: 'Other', label: 'Other' },
    ];

    const statuses = [
        { value: 'available', label: 'Available' },
        { value: 'maintenance', label: 'Under Maintenance' },
        { value: 'closed', label: 'Closed' },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddAmenity = (e) => {
        e.preventDefault();
        if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
            setAmenities([...amenities, newAmenity.trim()]);
            setNewAmenity('');
        }
    };

    const handleRemoveAmenity = (amenity) => {
        setAmenities(amenities.filter(a => a !== amenity));
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(images.filter((_, idx) => idx !== indexToRemove));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do NOT set Content-Type here, browser sets it with boundary for FormData automatically
                },
                body: uploadData
            });

            if (response.ok) {
                const data = await response.json();
                setImages([...images, data.url]);
            } else {
                const error = await response.json();
                alert(`Upload failed: ${error.message}`);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Make sure the backend limit is respected.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!facility) return;
        setIsSubmitting(true);
        
        try {
            const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/facilities/${facility.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    facility_name: formData.name,
                    facility_type: formData.type,
                    hourly_rate_php: parseFloat(formData.hourlyRate),
                    total_capacity: parseInt(formData.capacity),
                    facility_description: formData.description,
                    facility_status: formData.status,
                    facility_location: formData.location,
                    facility_surface: formData.surface,
                    facility_size: formData.size,
                    facility_images: images,
                    facility_amenities: amenities
                })
            });

            if (response.ok) {
                onClose();
                if (onRefresh) onRefresh();
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating facility:', error);
            alert('Failed to update facility.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Facility Editor"
            size="large" // Make it larger to accommodate rich editing
            footer={
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving Changes...' : 'Save All Changes'}
                    </Button>
                </div>
            }
        >
            {/* Tabs Navigation */}
            <div className="flex border-b border-[var(--border-subtle)] mb-6">
                <button
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-[var(--accent-green)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <Info size={16} /> Overview
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'details' ? 'border-[var(--accent-green)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    onClick={() => setActiveTab('details')}
                >
                    <MapPin size={16} /> Details & Amenities
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'gallery' ? 'border-[var(--accent-green)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    <ImageIcon size={16} /> Photo Gallery
                </button>
            </div>

            <div className="min-h-[400px]">
                {/* TAB 01: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <Input
                            label="Facility Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Basketball Court A"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Facility Type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                options={facilityTypes}
                                required
                            />
                            <Select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={statuses}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Hourly Rate (₱)"
                                name="hourlyRate"
                                type="number"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                placeholder="500"
                                required
                            />
                            <Input
                                label="Capacity (people)"
                                name="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={handleChange}
                                placeholder="20"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-green)] transition-colors min-h-[100px] text-[var(--text-primary)] resize-y"
                                placeholder="Describe the facility..."
                            ></textarea>
                        </div>
                    </div>
                )}

                {/* TAB 02: DETAILS & AMENITIES */}
                {activeTab === 'details' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Location/Building"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., North Wing"
                            />
                            <Input
                                label="Surface Type"
                                name="surface"
                                value={formData.surface}
                                onChange={handleChange}
                                placeholder="e.g., Hardwood, Turf"
                            />
                            <Input
                                label="Dimensions/Size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder="e.g., 28m x 15m"
                            />
                        </div>

                        <div className="pt-4 border-t border-[var(--border-subtle)]">
                            <h3 className="text-lg font-bold mb-4">Amenities</h3>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {amenities.map(amenity => (
                                    <div key={amenity} className="flex items-center gap-2 bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-full border border-[var(--border-subtle)]">
                                        <span className="text-sm">{amenity}</span>
                                        <button 
                                            onClick={() => handleRemoveAmenity(amenity)}
                                            className="text-[var(--text-muted)] hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {amenities.length === 0 && <span className="text-[var(--text-muted)] text-sm italic">No amenities added yet.</span>}
                            </div>

                            <form onSubmit={handleAddAmenity} className="flex gap-2">
                                <Input
                                    placeholder="e.g., Air Conditioning, Scoreboard..."
                                    value={newAmenity}
                                    onChange={(e) => setNewAmenity(e.target.value)}
                                    // Remove the label strictly for this inline input design
                                    className="flex-1"
                                />
                                <Button type="submit" variant="secondary" className="mt-1 whitespace-nowrap">
                                    Add Tag
                                </Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* TAB 03: GALLERY UPLOAD */}
                {activeTab === 'gallery' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-subtle)]">
                            <div>
                                <h3 className="font-bold">Facility Photos</h3>
                                <p className="text-sm text-[var(--text-muted)]">Upload high-res images. The first image will be used as the hero banner.</p>
                            </div>
                            <div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <Button 
                                    variant="primary" 
                                    className="gap-2"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? <span className="animate-pulse">Uploading...</span> : <><Upload size={16} /> Upload Photo</>}
                                </Button>
                            </div>
                        </div>

                        {images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-[var(--border-subtle)] aspect-video bg-[var(--bg-tertiary)]">
                                        <img src={img} alt={`Facility photo ${idx + 1}`} className="w-full h-full object-cover" />
                                        
                                        {/* Overlay Controls */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                onClick={() => handleRemoveImage(idx)}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
                                                title="Delete this photo"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                        {idx === 0 && (
                                            <div className="absolute top-2 left-2 bg-[var(--accent-green)] text-black text-xs font-bold px-2 py-1 rounded shadow-md">
                                                Main Hero
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-secondary)]/50">
                                <ImageIcon size={48} className="text-[var(--text-muted)] mb-4 opacity-50" />
                                <h4 className="text-lg font-medium text-[var(--text-secondary)] mb-1">No photos yet</h4>
                                <p className="text-sm text-[var(--text-muted)] max-w-sm text-center">
                                    Upload photos of the court, amenities, or building exterior to attract more students.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};
