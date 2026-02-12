import { useState } from "react";
import { Card, Badge } from "../../components/ui";
import { Search, UserX, UserCheck, Eye, X } from "lucide-react";

export function UserManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [users, setUsers] = useState([
        { id: "U-001", name: "John Doe", email: "john@example.com", bookings: 5, status: "active" },
        { id: "U-002", name: "Jane Smith", email: "jane@example.com", bookings: 2, status: "inactive" },
        { id: "U-003", name: "Mike Ross", email: "mike@example.com", bookings: 8, status: "active" },
        { id: "U-004", name: "Harvey Specter", email: "Harvey@example.com", bookings: 7, status: "active" },
        { id: "U-005", name: "Louis Litt", email: "littfire@example.com", bookings: 6, status: "active" },
    ]);

    const toggleUserStatus = (id) => {
        setUsers(
            users.map((user) =>
                user.id === id
                    ? { ...user, status: user.status === "active" ? "inactive" : "active" }
                    : user
            )
        );
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-[var(--text-secondary)]">Search and manage renter accounts</p>
            </div>

            {/* Card with table */}
            <Card variant="elevated">
                <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg focus:outline-none focus:border-[var(--accent-green)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm">
                            <tr>
                                <th className="p-4 font-medium">User ID</th>
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Bookings</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                                    <td className="p-4 font-medium">{user.id}</td>
                                    <td className="p-4 flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-[var(--accent-green)] text-black flex items-center justify-center text-xs font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        {user.name}
                                    </td>
                                    <td className="p-4 text-[var(--text-secondary)]">{user.email}</td>
                                    <td className="p-4">{user.bookings}</td>
                                    <td className="p-4">
                                        <Badge variant={user.status === "active" ? "success" : "error"}>{user.status}</Badge>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button
                                            title="View Booking History"
                                            className="p-1 rounded hover:bg-blue-500/10 text-blue-500"
                                            onClick={() => openModal(user)}
                                        >
                                            <Eye size={18} />
                                        </button>

                                        <button
                                            title={user.status === "active" ? "Deactivate User" : "Activate User"}
                                            onClick={() => toggleUserStatus(user.id)}
                                            className={`p-1 rounded ${user.status === "active"
                                                ? "hover:bg-red-500/10 text-red-500"
                                                : "hover:bg-green-500/10 text-green-500"
                                                }`}
                                        >
                                            {user.status === "active" ? <UserX size={18} /> : <UserCheck size={18} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Plain modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={closeModal}
                    ></div>

                    {/* Modal content */}
                    <div className="bg-[var(--bg-primary)] rounded-lg shadow-lg z-50 max-w-lg w-full p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 p-1 hover:bg-[var(--bg-secondary)] rounded"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Booking History - {selectedUser?.name}
                        </h2>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {[...Array(selectedUser?.bookings || 0)].map((_, idx) => (
                                <p key={idx} className="text-[var(--text-secondary)]">
                                    Booking #{idx + 1} - Example date/time
                                </p>
                            ))}
                            {selectedUser?.bookings === 0 && <p>No bookings yet</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
