import { Card, Button } from '../../components/ui';
import { Calendar, Filter } from 'lucide-react';

export function BookingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">All Bookings</h1>
                    <p className="text-[var(--text-secondary)]">View and manage all facility bookings</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter size={18} /> Filter
                </Button>
            </div>

            <Card variant="elevated" className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
                <h3 className="text-xl font-bold mb-2">Bookings Calendar View</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                    This page will show a calendar view of all bookings across facilities.
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                    Coming soon - Full calendar integration
                </p>
            </Card>
        </div>
    );
}
