import { useState } from 'react';
import { Modal } from '../Modal';
import { Button, Input, Select, DatePicker, TimePicker } from '../ui';
import { User } from 'lucide-react';

export const NewBookingModal = ({ isOpen, onClose }) => {
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

    // Mock previous users - in real app, fetch from API
    const previousUsers = [
        { name: 'John Doe', email: 'john.doe@example.com', phone: '+63 912 345 6789' },
        { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+63 923 456 7890' },
        { name: 'Mike Ross', email: 'mike.ross@example.com', phone: '+63 934 567 8901' },
        { name: 'Sarah Cole', email: 'sarah.cole@example.com', phone: '+63 945 678 9012' },
        { name: 'Tom Hardy', email: 'tom.hardy@example.com', phone: '+63 956 789 0123' },
    ];

    const filteredUsers = previousUsers.filter(user =>
        user.name.toLowerCase().includes(formData.userName.toLowerCase()) ||
        user.email.toLowerCase().includes(formData.userName.toLowerCase())
    );

    const facilities = [
        { value: '', label: 'Select a facility' },
        { value: 'basketball-a', label: 'Basketball Court A' },
        { value: 'basketball-b', label: 'Basketball Court B' },
        { value: 'tennis-1', label: 'Tennis Court 1' },
        { value: 'tennis-2', label: 'Tennis Court 2' },
        { value: 'badminton', label: 'Badminton Hall' },
        { value: 'volleyball', label: 'Volleyball Arena' },
    ];

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
            userName: user.name,
            userEmail: user.email
        });
        setShowUserSuggestions(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Add validation and API call
        console.log('New booking:', formData);
        // Show success message
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
                    <Button variant="primary" onClick={handleSubmit}>
                        Create Booking
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
                        {showUserSuggestions && filteredUsers.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {filteredUsers.map((user, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => selectUser(user)}
                                        className="w-full text-left px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-subtle)] last:border-0"
                                    >
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-[var(--accent-green)]" />
                                            <div>
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
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
