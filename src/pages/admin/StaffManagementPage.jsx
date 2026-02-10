import { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AddStaffModal } from '../../components/modals/AddStaffModal';
import { EditStaffModal } from '../../components/modals/EditStaffModal';

export function StaffManagementPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const staff = [
        { id: 1, name: 'John Doe', email: 'john@sportsplex.com', phone: '+63 912 345 6789', role: 'Trainer', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@sportsplex.com', phone: '+63 923 456 7890', role: 'Receptionist', status: 'On Leave' },
        { id: 3, name: 'Mike Johnson', email: 'mike@sportsplex.com', phone: '+63 934 567 8901', role: 'Maintenance', status: 'Active' },
    ];

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
                            {staff.map((member) => (
                                <tr key={member.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                                    <td className="p-4 font-medium">{member.name}</td>
                                    <td className="p-4 text-[var(--text-secondary)]">{member.role}</td>
                                    <td className="p-4">
                                        <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
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
                                            <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                                                <Trash2 size={16} />
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
            <AddStaffModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditStaffModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} staffMember={selectedStaff} />
        </div>
    );
}
