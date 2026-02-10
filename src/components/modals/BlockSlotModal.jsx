import { useState } from 'react';
import { Modal } from '../Modal';
import { Button, Select, DatePicker, TimePicker, TextArea } from '../ui';
import { AlertTriangle } from 'lucide-react';

export const BlockSlotModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        facility: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        reason: '',
        blockType: 'maintenance'
    });

    const facilities = [
        { value: '', label: 'Select a facility' },
        { value: 'basketball-a', label: 'Basketball Court A' },
        { value: 'basketball-b', label: 'Basketball Court B' },
        { value: 'tennis-1', label: 'Tennis Court 1' },
        { value: 'tennis-2', label: 'Tennis Court 2' },
        { value: 'badminton', label: 'Badminton Hall' },
        { value: 'volleyball', label: 'Volleyball Arena' },
    ];

    const blockTypes = [
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'event', label: 'Private Event' },
        { value: 'renovation', label: 'Renovation' },
        { value: 'other', label: 'Other' },
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
        console.log('Block slot:', formData);
        alert('Time slot blocked successfully!');
        onClose();
        // Reset form
        setFormData({
            facility: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            reason: '',
            blockType: 'maintenance'
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Block Time Slot"
            size="medium"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Block Slot
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-[var(--text-secondary)]">
                        <p className="font-medium text-orange-500 mb-1">Important</p>
                        <p>Blocking a time slot will prevent users from making reservations during this period. Existing reservations will not be affected.</p>
                    </div>
                </div>

                <Select
                    label="Facility"
                    name="facility"
                    value={formData.facility}
                    onChange={handleChange}
                    options={facilities}
                    required
                />

                <Select
                    label="Block Type"
                    name="blockType"
                    value={formData.blockType}
                    onChange={handleChange}
                    options={blockTypes}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePicker
                        label="Start Date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                    <DatePicker
                        label="End Date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <TextArea
                    label="Reason (Optional)"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Provide details about why this slot is being blocked..."
                    rows={3}
                />

                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
                    <h4 className="font-medium mb-2 text-sm">Block Summary</h4>
                    <div className="text-sm text-[var(--text-secondary)] space-y-1">
                        <p><strong>Facility:</strong> {facilities.find(f => f.value === formData.facility)?.label || 'N/A'}</p>
                        <p><strong>Type:</strong> {blockTypes.find(t => t.value === formData.blockType)?.label || 'N/A'}</p>
                        <p><strong>Period:</strong> {formData.startDate && formData.endDate ? `${formData.startDate} to ${formData.endDate}` : 'N/A'}</p>
                        <p><strong>Time:</strong> {formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : 'N/A'}</p>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
