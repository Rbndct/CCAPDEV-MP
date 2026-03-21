import { useState } from 'react';
import { Modal } from '../Modal';
import { Button, Input, Select, TextArea } from '../ui';
import { useAuth, API_BASE_URL } from '../../contexts/AuthContext';

export const AddFacilityModal = ({ isOpen, onClose, onRefresh }) => {
    const { token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        hourlyRate: '',
        capacity: '',
        description: '',
        status: 'Available'
    });

    const facilityTypes = [
        { value: '', label: 'Select facility type' },
        { value: 'Basketball', label: 'Basketball' },
        { value: 'Tennis', label: 'Tennis' },
        { value: 'Badminton', label: 'Badminton' },
        { value: 'Volleyball', label: 'Volleyball' },
        { value: 'Swimming', label: 'Swimming Pool' },
        { value: 'Gym', label: 'Gym/Fitness' },
        { value: 'Other', label: 'Other' },
    ];

    const statuses = [
        { value: 'Available', label: 'Available' },
        { value: 'Maintenance', label: 'Under Maintenance' },
        { value: 'Unavailable', label: 'Unavailable' },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/facilities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    type: formData.type,
                    capacity: parseInt(formData.capacity),
                    hourly_rate: parseFloat(formData.hourlyRate),
                    status: formData.status,
                    description: formData.description
                })
            });

            if (response.ok) {
                alert('Facility added successfully!');
                onClose();
                if (onRefresh) onRefresh();
                // Reset form
                setFormData({
                    name: '',
                    type: '',
                    hourlyRate: '',
                    capacity: '',
                    description: '',
                    status: 'Available'
                });
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error adding facility:', error);
            alert('Failed to add facility.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Facility"
            size="medium"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Facility'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="50"
                        required
                    />
                    <Input
                        label="Capacity (people)"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="10"
                        required
                    />
                </div>

                <TextArea
                    label="Description (Optional)"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide details about the facility, amenities, rules, etc."
                    rows={3}
                />

                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
                    <h4 className="font-medium mb-2 text-sm">Facility Summary</h4>
                    <div className="text-sm text-[var(--text-secondary)] space-y-1">
                        <p><strong>Name:</strong> {formData.name || 'N/A'}</p>
                        <p><strong>Type:</strong> {facilityTypes.find(t => t.value === formData.type)?.label || 'N/A'}</p>
                        <p><strong>Rate:</strong> {formData.hourlyRate ? `₱${formData.hourlyRate}/hr` : 'N/A'}</p>
                        <p><strong>Capacity:</strong> {formData.capacity ? `${formData.capacity} people` : 'N/A'}</p>
                        <p><strong>Status:</strong> {formData.status}</p>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
