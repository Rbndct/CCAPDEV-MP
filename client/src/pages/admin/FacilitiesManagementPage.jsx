import { useState, useEffect } from 'react';
import { Card, Button } from '../../components/ui';
import { Plus, Edit2, Lock, Calendar } from 'lucide-react';
import { AddFacilityModal } from '../../components/modals/AddFacilityModal';
import { EditFacilityModal } from '../../components/modals/EditFacilityModal';
import { BlockSlotModal } from '../../components/modals/BlockSlotModal';
import { NewBookingModal } from '../../components/modals/NewBookingModal';
import { useAuth, API_BASE_URL } from '../../contexts/AuthContext';

export function FacilitiesManagementPage() {
    const { token } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [facilityForAction, setFacilityForAction] = useState(null);
    const [facilities, setFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFacilities = async () => {
        try {
            const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/facilities`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                // Map to what table expects
                const mapped = data.map(f => ({
                    id: f._id,
                    name: f.facility_name,
                    type: f.facility_type,
                    status: f.facility_status || 'available',
                    rate: `₱${f.hourly_rate_php || 500}/hr`,
                    capacity: f.total_capacity
                }));
                setFacilities(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch facilities:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchFacilities();
    }, [token]);

    const handleEdit = (facility) => {
        setSelectedFacility(facility);
        setIsEditModalOpen(true);
    };

    const handleBlock = (facility) => {
        setFacilityForAction(facility);
        setIsBlockModalOpen(true);
    };

    const handleBook = (facility) => {
        setFacilityForAction(facility);
        setIsBookModalOpen(true);
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-[var(--text-secondary)]">Loading facilities...</td>
                                </tr>
                            ) : facilities.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-[var(--text-secondary)]">No facilities found.</td>
                                </tr>
                            ) : (
                                facilities.map((facility) => (
                                    <tr key={facility.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                                        <td className="p-4 font-medium">{facility.name}</td>
                                        <td className="p-4 text-[var(--text-secondary)]">{facility.type}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${facility.status === 'available'
                                                ? 'bg-green-500/10 text-green-500'
                                                : facility.status === 'maintenance'
                                                    ? 'bg-orange-500/10 text-orange-500'
                                                    : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
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
                                                    className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                                                    title="Book for user"
                                                    onClick={() => handleBook(facility)}
                                                >
                                                    <Calendar size={16} />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-orange-500/10 text-orange-500 rounded-lg transition-colors"
                                                    title="Block / Set Maintenance"
                                                    onClick={() => handleBlock(facility)}
                                                >
                                                    <Lock size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modals */}
            <AddFacilityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onRefresh={fetchFacilities}
            />
            <EditFacilityModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                facility={selectedFacility}
                onRefresh={fetchFacilities}
            />
            <BlockSlotModal
                isOpen={isBlockModalOpen}
                onClose={() => { setIsBlockModalOpen(false); setFacilityForAction(null); }}
                defaultFacilityId={facilityForAction?.id}
            />
            <NewBookingModal
                isOpen={isBookModalOpen}
                onClose={() => { setIsBookModalOpen(false); setFacilityForAction(null); }}
                defaultFacilityId={facilityForAction?.id}
            />
        </div>
    );
}
