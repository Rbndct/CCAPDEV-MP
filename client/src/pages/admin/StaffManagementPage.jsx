import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AddStaffModal } from '../../components/modals/AddStaffModal';
import { EditStaffModal } from '../../components/modals/EditStaffModal';
import { useAuth, API_BASE_URL } from '../../contexts/AuthContext';

export function StaffManagementPage() {
    const { token } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staff, setStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStaff = async () => {
        try {
            const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                const staffUsers = data.filter(u => ['admin', 'staff'].includes(u.role));
                const mapped = staffUsers.map(u => ({
                    id: u._id,
                    name: u.full_name,
                    email: u.email,
                    phone: u.phone_number || 'N/A',
                    role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
                    status: u.status || (u.is_verified ? 'Active' : 'Inactive')
                }));
                setStaff(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch staff:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchStaff();
    }, [token]);

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus.toLowerCase() === 'active' ? 'inactive' : 'active';
        try {
            const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/users/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) fetchStaff();
        } catch (error) {
            console.error("Failed to toggle staff status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) return;
        
        try {
            const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setStaff(staff.filter(s => s.id !== id));
            } else {
                const data = await response.json();
                alert(data.message || "Failed to delete staff member.");
            }
        } catch (error) {
            console.error("Failed to delete staff:", error);
        }
    };

    const handleEdit = (staffMember) => {
        setSelectedStaff(staffMember);
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Staff Management</h1>
                <Button variant="primary" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={18} /> Add Staff
                </Button>
            </div>

            <Card variant="elevated" className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
                            <tr>
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-[var(--text-secondary)]">Loading staff...</td>
                                </tr>
                            ) : staff.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-[var(--text-secondary)]">No staff members found.</td>
                                </tr>
                            ) : (
                                staff.map((member) => (
                                    <tr key={member.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                                        <td className="p-4 font-medium">{member.name}</td>
                                        <td className="p-4 text-[var(--text-secondary)]">{member.role}</td>
                                        <td className="p-4">
                                            <Badge 
                                                variant={member.status.toLowerCase() === 'active' ? 'success' : 'warning'}
                                                className="cursor-pointer hover:opacity-80"
                                                onClick={() => handleStatusToggle(member.id, member.status)}
                                            >
                                                {member.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="p-2 hover:bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded-lg transition-colors"
                                                    onClick={() => handleEdit(member)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                    onClick={() => handleDelete(member.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modals */}
            <AddStaffModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchStaff} />
            <EditStaffModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} staffMember={selectedStaff} />
        </div>
    );
}
