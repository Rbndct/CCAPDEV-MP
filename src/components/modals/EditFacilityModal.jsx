import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Button, Input, Select, DatePicker, TimePicker } from '../ui';

export const EditFacilityModal = ({ isOpen, onClose, facility }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        hourlyRate: '',
        capacity: '',
        description: '',
        status: 'Available'
    });

    // Populate form when facility changes
    useEffect(() => {
        if (facility) {
            setFormData({
                name: facility.name || '',
                type: facility.type || '',
                hourlyRate: facility.rate?.replace('₱', '').replace('/hr', '') || '',
                capacity: facility.capacity || '',
                description: facility.description || '',
                status: facility.status || 'Available'
            });
        }
    }, [facility]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Add validation and API call
        console.log('Updated facility:', formData);
        alert('Facility updated successfully!');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Facility"
            size="medium"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
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

                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
                    <h4 className="font-medium mb-2 text-sm">Updated Information</h4>
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
