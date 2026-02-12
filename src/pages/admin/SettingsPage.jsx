import { useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { Save, Bell, Globe } from 'lucide-react';

export function AdminSettingsPage() {
    const [notifications, setNotifications] = useState({
        bookings: true,
        noShow: true,
        summary: false
    });

    const [general, setGeneral] = useState({
        businessName: 'SportsPlex',
        contactEmail: 'admin@sportsplex.com',
        timezone: 'GMT+8 (Manila)'
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Mock API call
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-[var(--text-secondary)]">Manage system preferences and configurations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card variant="elevated" className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-5 h-5 text-[var(--accent-green)]" />
                        <h3 className="text-xl font-bold">Notifications</h3>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm">Email notifications for new bookings</span>
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={notifications.bookings}
                                onChange={(e) => setNotifications({ ...notifications, bookings: e.target.checked })}
                            />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm">No-show alerts</span>
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={notifications.noShow}
                                onChange={(e) => setNotifications({ ...notifications, noShow: e.target.checked })}
                            />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm">Daily summary reports</span>
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={notifications.summary}
                                onChange={(e) => setNotifications({ ...notifications, summary: e.target.checked })}
                            />
                        </label>
                    </div>
                </Card>

                <Card variant="elevated" className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className="w-5 h-5 text-[var(--accent-green)]" />
                        <h3 className="text-xl font-bold">General Settings</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Business Name</label>
                            <Input
                                value={general.businessName}
                                onChange={(e) => setGeneral({ ...general, businessName: e.target.value })}
                                placeholder="SportsPlex"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Contact Email</label>
                            <Input
                                value={general.contactEmail}
                                onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                                placeholder="admin@sportsplex.com"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Timezone</label>
                            <select
                                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-2"
                                value={general.timezone}
                                onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                            >
                                <option>GMT+8 (Manila)</option>
                                <option>GMT+0 (UTC)</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button
                    variant="primary"
                    className="gap-2"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}
