import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Button, Select, DatePicker, TimePicker } from '../ui';

export const EditReservationModal = ({ isOpen, onClose, booking, onSave }) => {
    const facilities = [
        { value: 'Court A - Premium Basketball', label: 'Court A - Premium Basketball' },
        { value: 'Court B - Standard Basketball', label: 'Court B - Standard Basketball' },
        { value: 'Court C - Tennis Court 1', label: 'Court C - Tennis Court 1' },
        { value: 'Court D - Tennis Court 2', label: 'Court D - Tennis Court 2' },
        { value: 'Court E - Badminton Hall', label: 'Court E - Badminton Hall' },
        { value: 'Court F - Volleyball Arena', label: 'Court F - Volleyball Arena' },
    ];

    const [formData, setFormData] = useState({
        court: '',
        date: '',
        startTime: '',
        endTime: '',
    });

    // Pre-populate form when booking changes
    useEffect(() => {
        if (booking) {
            const [startTime, endTime] = booking.time.split(' - ');
            setFormData({
                court: booking.court,
                date: booking.date,
                startTime: startTime || '',
                endTime: endTime || '',
            });
        }
    }, [booking]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (!formData.court || !formData.date || !formData.startTime || !formData.endTime) {
            alert('Please fill in all fields.');
            return;
        }
        onSave({
            ...booking,
            court: formData.court,
            date: formData.date,
            time: `${formData.startTime} - ${formData.endTime}`,
        });
        onClose();
    };

    if (!booking) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Reservation"
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
                <Select
                    label="Facility / Court"
                    name="court"
                    value={formData.court}
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

                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
                    <h4 className="font-medium mb-2 text-sm">Updated Summary</h4>
                    <div className="text-sm text-[var(--text-secondary)] space-y-1">
                        <p><strong>Court:</strong> {formData.court || 'N/A'}</p>
                        <p><strong>Date:</strong> {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                        <p><strong>Time:</strong> {formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : 'N/A'}</p>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
