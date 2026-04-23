import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type SettingsCardProps = PropsWithChildren<{
    className?: string;
    tone?: 'default' | 'danger';
}>;

export default function SettingsCard({
    children,
    className,
    tone = 'default',
}: SettingsCardProps) {
    return (
        <section
            className={cn(
                'glass-panel rounded-2xl border p-5 md:p-6',
                tone === 'danger'
                    ? 'border-red-400/25 bg-red-500/8 shadow-[0_0_30px_rgba(239,68,68,0.12)]'
                    : 'border-glass-border bg-glass-panel shadow-[0_0_30px_var(--color-neon-pink)/8]',
                className,
            )}
        >
            {children}
        </section>
    );
}
