import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../Modal';
import { Button, Input, Select, DatePicker, TimePicker } from '../ui';
import { User, Search } from 'lucide-react';
import { useAuth, API_BASE_URL } from '../../contexts/AuthContext';

export const NewBookingModal = ({ isOpen, onClose }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        facility: '',
        date: '',
        startTime: '',
        endTime: '',
        paymentStatus: 'unpaid'
    });
    const [showUserSuggestions, setShowUserSuggestions] = useState(false);
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [isSearchingUsers, setIsSearchingUsers] = useState(false);

    // Debounced user search
    useEffect(() => {
        const q = formData.userName.trim();
        if (!q) {
            setUserSearchResults([]);
            setShowUserSuggestions(false);
            return;
        }
        const timer = setTimeout(async () => {
            setIsSearchingUsers(true);
            try {
                const res = await fetch(`${API_BASE_URL}/profiles/search?q=${encodeURIComponent(q)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserSearchResults(data);
                    setShowUserSuggestions(true);
                }
            } catch (e) {
                console.error('User search error', e);
            } finally {
                setIsSearchingUsers(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [formData.userName, token]);

    const [facilities, setFacilities] = useState([{ value: '', label: 'Loading facilities...' }]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/facilities`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                const options = [
                    { value: '', label: 'Select a facility' },
                    ...data.map(f => ({ value: f._id, label: f.facility_name || f.name }))
                ];
                setFacilities(options);
            } catch (error) {
                console.error('Error fetching facilities:', error);
                setFacilities([{ value: '', label: 'Error loading facilities' }]);
            }
        };
        fetchFacilities();
    }, []);

    const paymentOptions = [
        { value: 'unpaid', label: 'Unpaid' },
        { value: 'paid', label: 'Paid' },
        { value: 'partial', label: 'Partial Payment' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'userName') {
            setShowUserSuggestions(value.length > 0);
        }
    };

    const selectUser = (user) => {
        setFormData({
            ...formData,
            userName: user.full_name || user.name,
            userEmail: user.email
        });
        setShowUserSuggestions(false);
        setUserSearchResults([]);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/reservations/walk-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    walk_in_name: formData.userName,
                    facility: formData.facility,
                    seat_number: 1, // Defaulting to 1 for sports courts
                    date: formData.date,
                    start_time: formData.startTime,
                    end_time: formData.endTime,
                    // reserved_by: user.id // In real app, get from AuthContext
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create booking');
            }

            alert('Booking created successfully!');
            onClose();
            // Reset form
            setFormData({
                userName: '',
                userEmail: '',
                facility: '',
                date: '',
                startTime: '',
                endTime: '',
                paymentStatus: 'unpaid'
            });
        } catch (error) {
            console.error('Error creating booking:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Booking"
            size="medium"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Booking'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* User Name with Autocomplete */}
                    <div className="relative">
                        <Input
                            label="User Name"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            onFocus={() => setShowUserSuggestions(formData.userName.length > 0)}
                            placeholder="Start typing to see previous users..."
                            required
                        />
                        {showUserSuggestions && userSearchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {isSearchingUsers && (
                                    <div className="px-4 py-2 text-xs text-[var(--text-muted)]">Searching...</div>
                                )}
                                {userSearchResults.map((user, index) => (
                                    <button
                                        key={user._id || index}
                                        type="button"
                                        onClick={() => selectUser(user)}
                                        className="w-full text-left px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-subtle)] last:border-0"
                                    >
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-[var(--accent-green)]" />
                                            <div>
                                                <p className="font-medium text-sm">{user.full_name}</p>
                                                <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        {showUserSuggestions && !isSearchingUsers && userSearchResults.length === 0 && formData.userName.trim() && (
                            <div className="absolute z-10 w-full mt-1 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg shadow-lg">
                                <p className="px-4 py-3 text-sm text-[var(--text-muted)]">No players found</p>
                            </div>
                        )}
                    </div>
                    <Input
                        label="User Email"
                        name="userEmail"
                        type="email"
                        value={formData.userEmail}
                        onChange={handleChange}
                        placeholder="user@example.com"
                        required
                    />
                </div>

                <Select
                    label="Facility"
                    name="facility"
                    value={formData.facility}
                    onChange={handleChange}
                    options={facilities}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DatePicker
                        label="Date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    <TimePicker
                        label="Start Time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    />
                    <TimePicker
                        label="End Time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Select
                    label="Payment Status"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    options={paymentOptions}
                />

                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
                    <h4 className="font-medium mb-2 text-sm">Booking Summary</h4>
                    <div className="text-sm text-[var(--text-secondary)] space-y-1">
                        <p><strong>User:</strong> {formData.userName || 'N/A'}</p>
                        <p><strong>Facility:</strong> {facilities.find(f => f.value === formData.facility)?.label || 'N/A'}</p>
                        <p><strong>Date:</strong> {formData.date || 'N/A'}</p>
                        <p><strong>Time:</strong> {formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : 'N/A'}</p>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
