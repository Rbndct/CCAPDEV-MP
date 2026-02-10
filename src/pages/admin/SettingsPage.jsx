import { Card, Button, Input } from '../../components/ui';
import { Save, Bell, Moon, Globe } from 'lucide-react';

export function SettingsPage() {
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
                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm">No-show alerts</span>
                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm">Daily summary reports</span>
                            <input type="checkbox" className="w-4 h-4" />
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
                            <Input placeholder="SportsPlex" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Contact Email</label>
                            <Input placeholder="admin@sportsplex.com" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Timezone</label>
                            <select className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-2">
                                <option>GMT+8 (Manila)</option>
                                <option>GMT+0 (UTC)</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button variant="primary" className="gap-2">
                    <Save size={18} /> Save Changes
                </Button>
            </div>
        </div>
    );
}
