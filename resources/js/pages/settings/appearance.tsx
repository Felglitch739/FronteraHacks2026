import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import SettingsCard from '@/components/settings/settings-card';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <SettingsCard>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <AppearanceTabs className="bg-background/40 ring-1 ring-glass-border" />
                </div>
            </SettingsCard>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};
