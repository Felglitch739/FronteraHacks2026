import { Link } from '@inertiajs/react';
import { Palette, ShieldCheck, UserRound } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: UserRound,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: ShieldCheck,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="space-y-5 px-0 py-2 md:px-4 md:py-4">
            <header className="glass-panel rounded-2xl border border-glass-border bg-glass-panel p-5 shadow-[0_0_30px_var(--color-neon-blue)/12] md:p-6">
                <p className="font-['Orbitron',sans-serif] text-[11px] tracking-[0.28em] text-neon-blue/75 uppercase">
                    Account Center
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">
                    Settings
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Manage your profile, security, and visual preferences in one place.
                </p>
            </header>

            <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                <aside className="glass-panel h-fit rounded-2xl border border-glass-border bg-glass-panel p-3 shadow-[0_0_24px_var(--color-neon-pink)/10] md:p-4">
                    <nav
                        className="flex flex-col gap-2"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => (
                            <Link
                                key={`${toUrl(item.href)}-${index}`}
                                href={item.href}
                                className={cn(
                                    'group inline-flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition',
                                    {
                                        'border-neon-blue/40 bg-neon-blue/10 text-neon-blue shadow-[0_0_16px_var(--color-neon-blue)/12]':
                                            isCurrentOrParentUrl(item.href),
                                        'border-transparent text-muted-foreground hover:border-glass-border hover:bg-background/45 hover:text-foreground':
                                            !isCurrentOrParentUrl(item.href),
                                    },
                                )}
                            >
                                {item.icon ? (
                                    <item.icon className="h-4 w-4" />
                                ) : null}
                                <span>{item.title}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                <section className="space-y-5" aria-label="Settings content">
                    <div className="rounded-2xl border border-glass-border/70 bg-background/35 p-0">
                        <div className="space-y-5 p-1 sm:p-2 md:p-0">
                            <div className="space-y-5">{children}</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
