import { useState } from 'react';
import { Modal } from '../Modal';
import { Button, Input, Select } from '../ui';

export const AddStaffModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        status: 'Active'
    });

    const roles = [
        { value: '', label: 'Select a role' },
        { value: 'Trainer', label: 'Trainer' },
        { value: 'Receptionist', label: 'Receptionist' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Cleaner', label: 'Cleaner' },
    ];

    const statuses = [
        { value: 'Active', label: 'Active' },
        { value: 'On Leave', label: 'On Leave' },
        { value: 'Inactive', label: 'Inactive' },
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
        console.log('New staff:', formData);
        alert('Staff member added successfully!');
        onClose();
        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: '',
            status: 'Active'
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Staff Member"
            size="medium"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add Staff
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter staff member's full name"
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="staff@example.com"
                        required
                    />
                    <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+63 XXX XXX XXXX"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={roles}
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

                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
                    <h4 className="font-medium mb-2 text-sm">Staff Summary</h4>
                    <div className="text-sm text-[var(--text-secondary)] space-y-1">
                        <p><strong>Name:</strong> {formData.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {formData.email || 'N/A'}</p>
                        <p><strong>Role:</strong> {formData.role || 'N/A'}</p>
                        <p><strong>Status:</strong> {formData.status}</p>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
