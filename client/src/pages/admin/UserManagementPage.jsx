import { useState, useEffect } from "react";
import { Card, Badge } from "../../components/ui";
import { Search, UserX, UserCheck, Eye, X, Calendar, Clock } from "lucide-react";
import { useAuth, API_BASE_URL } from "../../contexts/AuthContext";

export function UserManagementPage() {
    const { token } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userBookings, setUserBookings] = useState([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                const mappedUsers = data.map(user => ({
                    id: user._id,
                    name: user.full_name,
                    email: user.email,
                    role: user.role || 'student',
                    bookings: user.booking_count || 0,
                    status: user.status || (user.is_verified ? "active" : "inactive"),
                    joinedAt: user.created_at
                }));

                setUsers(mappedUsers);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const toggleUserStatus = async (id) => {
        const user = users.find(u => u.id === id);
        if (!user) return;

        const newStatus = user.status === "active" ? "inactive" : "active";

        // Optimistic update
        setUsers(users.map((u) =>
            u.id === id ? { ...u, status: newStatus } : u
        ));

        try {
            const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/users/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update status');
        } catch (error) {
            console.error("Error toggling user status:", error);
            // Revert on error
            setUsers(users.map((u) =>
                u.id === id ? { ...u, status: user.status } : u
            ));
            alert("Failed to update user status. Please try again.");
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = async (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setUserBookings([]);
        setIsLoadingBookings(true);

        try {
            // Fetch all reservations and filter by user ID
            const response = await fetch(`${API_BASE_URL || 'http://localhost:5001/api'}/admin/reservations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                const userRes = data.filter(r => r.user?._id === user.id || r.user === user.id);
                setUserBookings(userRes);
            }
        } catch (error) {
            console.error("Failed to fetch user bookings:", error);
        } finally {
            setIsLoadingBookings(false);
        }
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
        setUserBookings([]);
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed': return 'text-green-500 bg-green-500/10';
            case 'reserved': return 'text-green-500 bg-green-500/10';
            case 'cancelled': return 'text-red-500 bg-red-500/10';
            case 'no-show': return 'text-orange-500 bg-orange-500/10';
            case 'completed': return 'text-blue-500 bg-blue-500/10';
            default: return 'text-[var(--text-muted)] bg-[var(--bg-tertiary)]';
        }
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
                    <div className="text-sm text-[var(--text-muted)] flex items-center">
                        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} shown
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm">
                            <tr>
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Bookings</th>
                                <th className="p-4 font-medium">Joined</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                            {loading ? (
                                <tr><td colSpan="7" className="p-8 text-center text-[var(--text-muted)]">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-[var(--text-muted)]">No users found.</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                                        <td className="p-4 flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-[var(--accent-green)] text-black flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-medium">{user.name}</span>
                                        </td>
                                        <td className="p-4 text-[var(--text-secondary)]">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : user.role === 'staff' ? 'bg-blue-500/10 text-blue-400' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-[var(--accent-green)]">{user.bookings}</td>
                                        <td className="p-4 text-sm text-[var(--text-muted)]">
                                            {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                        </td>
                                        <td className="p-4">
                                            <Badge variant={user.status === "active" ? "success" : "error"}>{user.status}</Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
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
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Booking History Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/60" onClick={closeModal}></div>
                    <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl shadow-2xl z-50 max-w-2xl w-full p-6 relative max-h-[80vh] flex flex-col">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-1 hover:bg-[var(--bg-secondary)] rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent-green)] text-black flex items-center justify-center font-bold text-lg">
                                {selectedUser?.name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{selectedUser?.name}</h2>
                                <p className="text-sm text-[var(--text-muted)]">{selectedUser?.email} · {selectedUser?.bookings} booking{selectedUser?.bookings !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            {isLoadingBookings ? (
                                <p className="text-center text-[var(--text-muted)] py-8">Loading bookings...</p>
                            ) : userBookings.length === 0 ? (
                                <p className="text-center text-[var(--text-muted)] py-8">No bookings found for this user.</p>
                            ) : (
                                <div className="space-y-2">
                                    {userBookings.map((b, idx) => (
                                        <div key={b._id || idx} className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-4">
                                            <div>
                                                <p className="font-medium text-sm">{b.facility?.facility_name || b.facility?.name || 'Unknown Facility'}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-muted)]">
                                                    <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span className="flex items-center gap-1"><Clock size={11} /> {b.start_time} – {b.end_time}</span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusVariant(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
