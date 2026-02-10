import { useState } from 'react';
import { Card, Button } from '../../components/ui';
import { Plus, Edit2, Lock, Unlock, Archive } from 'lucide-react';
import { AddFacilityModal } from '../../components/modals/AddFacilityModal';
import { EditFacilityModal } from '../../components/modals/EditFacilityModal';

export function FacilitiesManagementPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);

    const facilities = [
        { id: 1, name: 'Basketball Court A', type: 'Basketball', status: 'Available', rate: '₱50/hr', capacity: 10 },
        { id: 2, name: 'Tennis Court 1', type: 'Tennis', status: 'Available', rate: '₱40/hr', capacity: 4 },
        { id: 3, name: 'Badminton Hall', type: 'Badminton', status: 'Maintenance', rate: '₱30/hr', capacity: 8 },
    ];

    const handleEdit = (facility) => {
        setSelectedFacility(facility);
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Facility Management</h1>
                    <p className="text-[var(--text-secondary)]">Manage sports facilities and availability</p>
                </div>
                <Button variant="primary" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={18} /> Add Facility
                </Button>
            </div>

            <Card variant="elevated" className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
                            <tr>
                                <th className="p-4 font-medium">Facility Name</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Hourly Rate</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facilities.map((facility) => (
                                <tr key={facility.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                                    <td className="p-4 font-medium">{facility.name}</td>
                                    <td className="p-4 text-[var(--text-secondary)]">{facility.type}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${facility.status === 'Available'
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-orange-500/10 text-orange-500'
                                            }`}>
                                            {facility.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[var(--text-secondary)]">{facility.rate}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="p-2 hover:bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded-lg transition-colors"
                                                onClick={() => handleEdit(facility)}
                                                title="Edit facility"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-orange-500/10 text-orange-500 rounded-lg transition-colors"
                                                title="Block facility"
                                            >
                                                <Lock size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modals */}
            <AddFacilityModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditFacilityModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} facility={selectedFacility} />
        </div>
    );
}
